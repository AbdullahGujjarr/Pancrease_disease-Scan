'use client';

import type { PancreasAssistantInput } from '@/ai/flows/pancreas-chat-flow';
import { askPancreasAssistantAction, type ChatbotFormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, useActionState } from 'react'; // Updated import
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
    <Button type="submit" size="icon" disabled={pending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      <span className="sr-only">Send message</span>
    </Button>
  );
}


export function Chatbot() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(askPancreasAssistantAction, { // Updated to useActionState
    response: null,
    error: null,
    userQuery: null,
  });
  
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.userQuery && !pending) { // Add user message once submitted and not pending anymore
        // Check if the last message is already this user query to avoid duplicates on resubmission/error
        if (chatHistory.length === 0 || chatHistory[chatHistory.length -1].content !== state.userQuery || chatHistory[chatHistory.length -1].role !== 'user') {
             setChatHistory(prev => [...prev, { role: 'user', content: state.userQuery as string }]);
        }
    }

    if (state?.response) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: state.response as string }]);
      // Reset form state by clearing userQuery after processing response.
      // This prevents re-adding user message on next interaction if state.userQuery isn't cleared.
      // However, useActionState is tricky. Better to clear currentQuery.
      setCurrentQuery(''); 
    }
    if (state?.error) {
      toast({
        title: 'Chatbot Error',
        description: state.error,
        variant: 'destructive',
      });
       // If there was an error, we might still want to keep the user's query in the input.
       // But the user message is already added to chat history.
    }
  }, [state, pending]); // Depend on state to react to form submission results

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentQuery.trim() || pending) return;

    const formData = new FormData(event.currentTarget);
    
    // Prepare chat history for the flow
    const flowHistory: PancreasAssistantInput['chatHistory'] = chatHistory
      .filter(msg => msg.role === 'user' || msg.role === 'assistant') // Filter out system messages if any
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model', // Map to 'user' or 'model'
        parts: [{ text: msg.content }]
      }));

    formData.append('chatHistory', JSON.stringify(flowHistory));
    formAction(formData);
    // User message is added to history via useEffect when state.userQuery is set
  };
  
  const handleQuickQuestion = (question: string) => {
    if (pending) return;
    setCurrentQuery(question);
    // Programmatically submit the form with the new question
    // Ensure currentQuery is part of formData for this submission.
    // The form's input field will update due to `value={currentQuery}`.
    // We then create new FormData and dispatch.
    const formData = new FormData();
    formData.append('query', question);

    const flowHistory: PancreasAssistantInput['chatHistory'] = chatHistory
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));
    formData.append('chatHistory', JSON.stringify(flowHistory));
    
    formAction(formData);
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
          {chatHistory.length === 0 && (
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
           {pending && state?.userQuery && ( // Optimistically show user message while pending
             <div className="flex items-end gap-2 justify-end">
                <div className="max-w-[75%] rounded-lg px-4 py-2 text-sm bg-primary text-primary-foreground opacity-70">
                    {state.userQuery}
                </div>
                <User className="w-6 h-6 text-muted-foreground self-start shrink-0" />
            </div>
           )}
        </ScrollArea>

        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Or try a quick question:</p>
            <div className="flex flex-wrap gap-2">
                {quickQuestions.map(q => (
                    <Button key={q} variant="outline" size="sm" onClick={() => handleQuickQuestion(q)} disabled={pending}>
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
            disabled={pending}
            autoComplete="off"
          />
          <ChatSubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}