'use client';

import type { PancreasAssistantInput } from '@/ai/flows/pancreas-chat-flow';
import { askPancreasAssistantAction, type ChatbotFormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react'; 
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react'; // Correct import for React.useActionState

// Helper to generate simple unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

interface ChatMessage {
  id: string; // Added unique ID
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const quickQuestions = [
  "What is Pancreas Vision?",
  "Tell me about common pancreatic diseases.",
  "What are symptoms of pancreatic problems?",
  "How can I reduce my risk of pancreatic diseases?",
  "How does the AI analysis work?",
];

function ChatSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      size="icon" 
      disabled={pending} 
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
      suppressHydrationWarning
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      <span className="sr-only">Send message</span>
    </Button>
  );
}


export function Chatbot() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null); 
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const initialChatbotState: ChatbotFormState = { response: null, error: null, userQuery: null };
  const [state, formAction, isChatPending] = useActionState(askPancreasAssistantAction, initialChatbotState);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isChatPending) {
      return;
    }

    const userQueryFromAction = state?.userQuery;
    const assistantResponse = state?.response;
    const actionError = state?.error;

    // Ensure state is not the initial default state before processing
    if (state && (state.response || state.error || state.userQuery !== initialChatbotState.userQuery )) {
      if (submittedQuery && userQueryFromAction === submittedQuery) {
        const newMessages: ChatMessage[] = [];
        newMessages.push({ id: generateId(), role: 'user', content: userQueryFromAction });
        
        if (assistantResponse) {
          newMessages.push({ id: generateId(), role: 'assistant', content: assistantResponse });
        }
        
        setChatHistory((prevHistory) => [...prevHistory, ...newMessages]);
        setSubmittedQuery(null);
      } else if (submittedQuery && actionError && userQueryFromAction === submittedQuery) {
        toast({
          title: 'Chatbot Error',
          description: actionError,
          variant: 'destructive',
        });
        setSubmittedQuery(null);
      } else if (actionError && !userQueryFromAction) { 
        // This handles generic errors not tied to a specific submittedQuery that matches.
        // Only toast if there's an actual error message.
        toast({
            title: 'Chatbot Error',
            description: actionError, // actionError is already checked to be non-null
            variant: 'destructive',
        });
        if (submittedQuery) { 
          setSubmittedQuery(null);
        }
      } else if (actionError && userQueryFromAction && submittedQuery && userQueryFromAction !== submittedQuery) {
        // Error for a different query than optimistically shown.
        toast({
          title: 'Chatbot Error',
          description: `An error occurred: ${actionError}. Your previous query '${submittedQuery}' might not have completed.`,
          variant: 'destructive',
        });
        setSubmittedQuery(null);
      }
    }
  }, [state, isChatPending, toast, submittedQuery, setChatHistory, setSubmittedQuery, initialChatbotState.userQuery]);


  const commonSubmitLogic = (query: string) => {
    // Block if query is empty, an action is pending, or another query is already optimistically submitted
    if (!query.trim() || isChatPending || submittedQuery) return; 
    
    setSubmittedQuery(query); 
    setCurrentQuery('');     

    const formData = new FormData();
    formData.append('query', query);
    
    const flowHistory: PancreasAssistantInput['chatHistory'] = chatHistory
      .filter(msg => msg.role === 'user' || msg.role === 'assistant') 
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model', 
        parts: [{ text: msg.content }]
      }));

    formData.append('chatHistory', JSON.stringify(flowHistory));
    formAction(formData); 
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    commonSubmitLogic(currentQuery);
  };
  
  const handleQuickQuestion = (question: string) => {
    commonSubmitLogic(question);
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl mt-12">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          <CardTitle className="text-2xl text-primary">Pancreas Assistant</CardTitle>
        </div>
        <CardDescription>
          Ask questions about pancreatic health, diseases, or the Pancreas Vision tool.
          <span className="block text-xs mt-1">I am an AI and cannot provide medical advice.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] w-full border rounded-md p-4" ref={scrollAreaRef}>
          {chatHistory.length === 0 && !isChatPending && !submittedQuery && (
            <div className="flex flex-col items-center justify-center h-full">
              <Sparkles className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Ask me anything about pancreas health!</p>
            </div>
          )}
          {chatHistory.map((msg) => (
            <div
              key={msg.id} 
              className={`flex items-end gap-2 mb-2 last:mb-0 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && <Bot className="w-6 h-6 text-primary self-start shrink-0" />}
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap break-words
                  ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && <User className="w-6 h-6 text-muted-foreground self-start shrink-0" />}
            </div>
          ))}
           {isChatPending && submittedQuery && ( 
             <div key="optimistic-user-query" className="flex items-end gap-2 justify-end mb-2">
                <div className="max-w-[75%] rounded-lg px-4 py-2 text-sm bg-primary text-primary-foreground opacity-70 whitespace-pre-wrap break-words">
                    {submittedQuery}
                </div>
                <User className="w-6 h-6 text-muted-foreground self-start shrink-0" />
            </div>
           )}
        </ScrollArea>

        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Or try a quick question:</p>
            <div className="flex flex-wrap gap-2">
                {quickQuestions.map(q => (
                    <Button 
                      key={q} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickQuestion(q)} 
                      disabled={isChatPending || !!submittedQuery} 
                      suppressHydrationWarning 
                    >
                        {q}
                    </Button>
                ))}
            </div>
        </div>

        <form onSubmit={handleSubmit} ref={formRef} className="flex items-center gap-2 pt-4">
          <Input
            name="query"
            placeholder="Type your question..."
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
            className="flex-grow"
            disabled={isChatPending || !!submittedQuery} 
            autoComplete="off"
            suppressHydrationWarning 
          />
          <ChatSubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

