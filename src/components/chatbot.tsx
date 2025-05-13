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

interface ChatMessage {
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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isChatPending] = useActionState(askPancreasAssistantAction, { 
    response: null,
    error: null,
    userQuery: null,
  });
  
  useEffect(() => {
    // This effect handles the result of the form action from useActionState
    if (isChatPending) {
      // Action is pending. `submittedQuery` should have been set by the submit handler
      // to show a visual pending state for the user's message.
      return;
    }
  
    // Action has completed (isChatPending is false).
    // `state` now holds the result of the action.
  
    let newMessagesStaged: ChatMessage[] = [];
  
    // 1. Process the user's query from the completed action
    if (state?.userQuery && (state.response || state.error)) { // Ensure this query was part of the action that completed
      const lastMessageInHistory = chatHistory[chatHistory.length - 1];
      // Add user query if it's not already the very last message and a 'user' message
      if (!(lastMessageInHistory?.role === 'user' && lastMessageInHistory?.content === state.userQuery)) {
        newMessagesStaged.push({ role: 'user', content: state.userQuery });
      }
    }
  
    // 2. Process the assistant's response
    if (state?.response) {
      // Check against the true last message (either from history or the user message just staged)
      const lastEffectiveMessage = newMessagesStaged.length > 0
        ? newMessagesStaged[newMessagesStaged.length - 1]
        : chatHistory[chatHistory.length - 1];
      
      // Add assistant response if it's not already the very last message and an 'assistant' message
      if (!(lastEffectiveMessage?.role === 'assistant' && lastEffectiveMessage?.content === state.response)) {
        newMessagesStaged.push({ role: 'assistant', content: state.response });
      }
    }
  
    // 3. Batch update chatHistory if new messages were staged
    if (newMessagesStaged.length > 0) {
      setChatHistory(prevChatHistory => [...prevChatHistory, ...newMessagesStaged]);
      // If an assistant response was part of the staged messages, clear the input field.
      if (newMessagesStaged.some(msg => msg.role === 'assistant' && msg.content === state?.response)) {
        setCurrentQuery('');
      }
    }
  
    // 4. Handle and display any errors from the action
    if (state?.error) {
      toast({
        title: 'Chatbot Error',
        description: state.error,
        variant: 'destructive',
      });
    }
  
    // 5. Clear the `submittedQuery` (which is used to visually show the user's message in a pending state)
    //    as the action is no longer pending.
    setSubmittedQuery(null);
  
  }, [state, isChatPending, toast]); // IMPORTANT: chatHistory is NOT a dependency here to prevent loops.
                                     // setCurrentQuery is also removed as it's handled conditionally.


  useEffect(() => {
    // This effect is solely for scrolling the chat container when chatHistory updates.
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]); // Only depends on chatHistory.

  const commonSubmitLogic = (query: string) => {
    if (!query.trim() || isChatPending) return;
    
    setSubmittedQuery(query); // Display this query as pending
    setCurrentQuery(''); // Clear input field immediately after submission attempt

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
        <ScrollArea className="h-[300px] w-full border rounded-md p-4 space-y-4" ref={chatContainerRef}>
          {chatHistory.length === 0 && !isChatPending && !submittedQuery && (
            <div className="flex flex-col items-center justify-center h-full">
              <Sparkles className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Ask me anything about pancreas health!</p>
            </div>
          )}
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && <Bot className="w-6 h-6 text-primary self-start shrink-0" />}
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap
                  ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && <User className="w-6 h-6 text-muted-foreground self-start shrink-0" />}
            </div>
          ))}
           {isChatPending && submittedQuery && ( 
             <div className="flex items-end gap-2 justify-end">
                <div className="max-w-[75%] rounded-lg px-4 py-2 text-sm bg-primary text-primary-foreground opacity-70">
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
                      disabled={isChatPending}
                      suppressHydrationWarning 
                    >
                        {q}
                    </Button>
                ))}
            </div>
        </div>

        <form onSubmit={handleSubmit} ref={formRef} className="flex items-center gap-2 pt-4">
          <Input
            name="query" // Name attribute is good for non-JS form submission, but here we control it.
            placeholder="Type your question..."
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
            className="flex-grow"
            disabled={isChatPending}
            autoComplete="off"
            suppressHydrationWarning 
          />
          <ChatSubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
