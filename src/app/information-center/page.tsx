// 'use client';
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, MessageSquare, HelpCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    id: 'faq1',
    question: "What is Pancreas Vision?",
    answer: "Pancreas Vision is an AI-powered tool designed to assist in the preliminary analysis of pancreas scans for potential signs of common diseases. It provides probability scores based on image analysis. It is not a diagnostic tool and should not replace professional medical advice from a qualified healthcare provider."
  },
  {
    id: 'faq2',
    question: "How does the AI analysis work?",
    answer: "The AI analyzes uploaded pancreas scan images (JPG or PNG format) using deep learning models trained on medical imaging data. It identifies patterns and features that may be associated with certain pancreatic conditions and calculates probability scores for each."
  },
  {
    id: 'faq3',
    question: "What diseases does Pancreas Vision look for?",
    answer: "Currently, the AI is trained to look for potential signs of Pancreatic Cancer, Chronic Pancreatitis, Pancreatic Cysts, and Acute Pancreatitis."
  },
  {
    id: 'faq4',
    question: "Are the results a medical diagnosis?",
    answer: "No, absolutely not. The results provided by Pancreas Vision are for informational and preliminary assessment purposes only. They are not a substitute for a comprehensive diagnosis from a qualified medical professional. Always consult a doctor for any health concerns."
  },
  {
    id: 'faq5',
    question: "What should I do with the analysis results?",
    answer: "You can download the PDF report and discuss the findings with your doctor or a specialist. They can interpret the results in the context of your overall health, medical history, and other diagnostic tests."
  },
  {
    id: 'faq6',
    question: "Is my uploaded data secure?",
    answer: "We prioritize user privacy. Please refer to our (hypothetical) privacy policy for detailed information on data handling. For this demonstration, images are processed for analysis and not stored long-term beyond the session if not explicitly stated otherwise."
  },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

const predefinedBotResponses: Record<string, string> = {
  "hello": "Hello! How can I help you today regarding Pancreas Vision or general pancreatic health?",
  "hi": "Hi there! Ask me anything about the pancreas or this application.",
  "what is pancreas vision": faqs.find(f => f.id === 'faq1')?.answer || "Pancreas Vision is an AI analysis tool. See the FAQs for more details.",
  "how does ai work": faqs.find(f => f.id === 'faq2')?.answer || "The AI analyzes images. More details are in the FAQs.",
  "what diseases": faqs.find(f => f.id === 'faq3')?.answer || "It looks for several pancreatic diseases. Check the FAQs!",
  "is it a diagnosis": faqs.find(f => f.id === 'faq4')?.answer || "No, it's not a diagnosis. Always consult a doctor.",
  "thank you": "You're welcome! Let me know if you have more questions.",
  "thanks": "You're welcome! Feel free to ask anything else.",
  "bye": "Goodbye! Take care and stay healthy.",
};

const defaultBotResponse = "I'm here to help with questions about Pancreas Vision and general pancreatic health. For specific medical advice or diagnosis, please consult a qualified healthcare professional. You might find your answer in the FAQs above!";

const suggestedQuestions = [
    "What is Pancreas Vision?",
    "How does the AI analysis work?",
    "Is this a medical diagnosis?",
    "What are common symptoms of pancreatic issues?",
];


export default function InformationCenterPage() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory]);

  const getBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase().trim();
    for (const key in predefinedBotResponses) {
      if (lowerQuery.includes(key)) {
        return predefinedBotResponses[key];
      }
    }
    if (lowerQuery.includes("symptom")) return "Common symptoms of pancreatic issues can include abdominal pain (often radiating to the back), unexplained weight loss, jaundice (yellowing of skin/eyes), changes in stool, nausea, and vomiting. However, symptoms vary and require medical evaluation. Please see the specific disease pages for more details.";
    if (lowerQuery.includes("risk") || lowerQuery.includes("prevent")) return "You can reduce your risk by maintaining a healthy diet and weight, avoiding smoking, limiting alcohol, and managing diabetes. Check out our 'Prevention' page for more details!";
    return defaultBotResponse;
  };

  const handleChatSubmit = (queryToSubmit?: string) => {
    const query = (queryToSubmit || currentQuery).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };
    setChatHistory(prev => [...prev, userMessage]);
    setCurrentQuery('');
    setIsBotTyping(true);

    setTimeout(() => {
      const botResponseText = getBotResponse(query);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: Date.now(),
      };
      setChatHistory(prev => [...prev, botMessage]);
      setIsBotTyping(false);
    }, 1000 + Math.random() * 500); // Simulate bot typing delay
  };
  
  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleChatSubmit();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <section className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 flex items-center justify-center gap-3">
            <HelpCircle className="h-10 w-10" /> Information Center
          </h1>
          <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
            Find answers to common questions and chat with our assistant for more information about Pancreas Vision and pancreatic health.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* FAQ Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <HelpCircle className="h-6 w-6" /> Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about Pancreas Vision and pancreatic health.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem value={faq.id} key={faq.id}>
                    <AccordionTrigger className="text-left hover:text-primary text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Chatbot Section */}
          <Card className="shadow-lg flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <MessageSquare className="h-6 w-6" /> Chat Assistant
              </CardTitle>
              <CardDescription>Ask our friendly assistant about Pancreas Vision or general pancreatic health topics.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col space-y-4 overflow-hidden">
              <ScrollArea className="h-[300px] sm:h-[350px] md:h-[400px] flex-grow border p-4 rounded-md bg-secondary/30" ref={scrollAreaRef}>
                {chatHistory.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Bot className="h-12 w-12 mb-2" />
                        <p>No messages yet. Ask something!</p>
                    </div>
                )}
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2 mb-3 text-sm",
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] p-3 rounded-xl shadow",
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-card text-card-foreground border rounded-bl-none'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                       <p className={cn("text-xs mt-1", msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left')}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isBotTyping && (
                    <div className="flex items-end gap-2 mb-3 text-sm justify-start">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[75%] p-3 rounded-xl shadow bg-card text-card-foreground border rounded-bl-none">
                            <div className="flex space-x-1">
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
              </ScrollArea>
              
              <div className="space-y-2 pt-2">
                 <p className="text-xs text-muted-foreground">Suggested questions:</p>
                 <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => {setCurrentQuery(q); handleChatSubmit(q);}} disabled={isBotTyping}>
                            {q}
                        </Button>
                    ))}
                 </div>
              </div>

              <form onSubmit={onFormSubmit} className="flex items-center gap-2 pt-2">
                <Input
                  type="text"
                  placeholder="Type your question..."
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  disabled={isBotTyping}
                  className="flex-grow"
                  autoComplete="off"
                />
                <Button type="submit" size="icon" disabled={isBotTyping || !currentQuery.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
