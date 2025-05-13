'use client';

import type { PancreasAssistantInput } from '@/ai/flows/pancreas-chat-flow';
import { askPancreasAssistantAction, type ChatbotFormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, useActionState } from 'react';
import { useFormStatus } from 'react-dom';

// Helper to generate simple unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

interface ChatMessage {
  id: string;
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

const initialChatbotState: ChatbotFormState = { response: null, error: null, userQuery: null };

export function Chatbot() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isChatPending] = useActionState(askPancreasAssistantAction, initialChatbotState);

  useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
    if (scrollViewport) {
      scrollViewport.scrollTop = scrollViewport.scrollHeight;
    }
  }, [chatHistory]);


  const actionResponse = state?.response;
  const actionError = state?.error;
  const actionUserQuery = state?.userQuery;

  useEffect(() => {
    if (isChatPending) {
      return;
    }

    // Check if the action has returned a non-initial state
    if (actionResponse !== null || actionError !== null || actionUserQuery !== null) {
      if (submittedQuery && actionUserQuery === submittedQuery) {
        const newMessages: ChatMessage[] = [];
        // The user message is now optimistically added, so only add assistant response
        if (actionResponse) {
          setChatHistory((prevHistory) => {
            // If the last message was the optimistic user message, replace it with the confirmed one and add assistant's
            // This is a simplified approach; more robust would involve IDs or checking content.
            // For now, we assume the optimistic user message is already there.
            return [...prevHistory, { id: generateId(), role: 'assistant', content: actionResponse }];
          });
        }
        setSubmittedQuery(null);
      } else if (submittedQuery && actionError && actionUserQuery === submittedQuery) {
         setChatHistory((prevHistory) => {
          // Add user's query if it failed, so it's visible.
          // If optimistic UI already added it, this might duplicate or need adjustment.
          // For simplicity, just ensure it's there.
          if (!prevHistory.find(msg => msg.role === 'user' && msg.content === actionUserQuery)) {
            return [...prevHistory, {id: generateId(), role: 'user', content: actionUserQuery}];
          }
          return prevHistory;
         });
        toast({
          title: 'Chatbot Error',
          description: actionError,
          variant: 'destructive',
        });
        setSubmittedQuery(null);
      } else if (actionError && !actionUserQuery && !submittedQuery) {
        toast({
            title: 'Chatbot Error',
            description: actionError,
            variant: 'destructive',
        });
      }
    }
  }, [
    actionResponse,
    actionError,
    actionUserQuery,
    isChatPending,
    toast,
    submittedQuery,
  ]);


  const commonSubmitLogic = (query: string) => {
    if (!query.trim() || isChatPending || submittedQuery) return;

    setSubmittedQuery(query);
    setCurrentQuery('');

    // Optimistically add user message to chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { id: `optimistic-${generateId()}`, role: 'user', content: query }
    ]);

    const formData = new FormData(formRef.current!); // Use formRef for FormData
    // formData.append('query', query); // query is already part of form data by name

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
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    commonSubmitLogic(query);
  };

  const handleQuickQuestion = (question: string) => {
    // Set the input field value, then trigger form submission logic
    // This ensures the named input 'query' is part of FormData
    if (formRef.current) {
        const queryInput = formRef.current.elements.namedItem('query') as HTMLInputElement;
        if (queryInput) {
            queryInput.value = question; // Set value for FormData
        }
    }
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
                  ${msg.role === 'user' ? `bg-primary text-primary-foreground ${msg.id.startsWith('optimistic-') ? 'opacity-70' : ''}` : 'bg-secondary text-secondary-foreground'}`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && <User className="w-6 h-6 text-muted-foreground self-start shrink-0" />}
            </div>
          ))}
           {isChatPending && submittedQuery && !chatHistory.find(m => m.content === submittedQuery && m.role === 'user') && ( // Show spinner only if optimistic UI didn't add it
             <div key="pending-indicator" className="flex items-end gap-2 justify-start mb-2">
                <Bot className="w-6 h-6 text-primary self-start shrink-0" />
                <div className="max-w-[75%] rounded-lg px-4 py-2 text-sm bg-secondary text-secondary-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
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
            name="query" // Ensure name attribute is present
            placeholder="Type your question..."
            value={currentQuery} // Control input with state
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
