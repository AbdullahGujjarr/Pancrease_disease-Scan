'use client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, AlertTriangle, HeartPulse, Zap } from 'lucide-react';
import Image from 'next/image';

export default function AcutePancreatitisPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary lucide lucide-siren"><path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5v0a5 5 0 0 1-5-5Z"/><path d="M5 12a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v0a7 7 0 0 1-7 7v0a7 7 0 0 1-7-7Z"/><path d="M12 22s-4-9-4-10a4 4 0 0 1 8 0c0 1-4 10-4 10Z"/><path d="M10 12h.01"/><path d="M14 12h.01"/></svg>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
              Understanding Acute Pancreatitis
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              A sudden and severe inflammation of the pancreas requiring prompt medical attention.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-destructive" /> What is Acute Pancreatitis?
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Acute pancreatitis is a sudden inflammation of the pancreas that can range from mild discomfort to a severe, life-threatening illness. The inflammation occurs when digestive enzymes, normally released into the small intestine, become activated inside the pancreas and start to damage pancreatic tissue. This condition requires prompt medical evaluation and treatment.
              </p>
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <Image
                    src="https://picsum.photos/600/300?random=4"
                    alt="Emergency medical care setting"
                    width={600}
                    height={300}
                    className="rounded-md mx-auto shadow-md"
                    data-ai-hint="emergency room"
                />
                <p className="text-xs text-center text-muted-foreground mt-2">Acute pancreatitis often requires emergency care.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-primary" /> Common Causes
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                The most common causes of acute pancreatitis include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground/90 leading-relaxed">
                <li><strong>Gallstones:</strong> Stones from the gallbladder can block the pancreatic duct.</li>
                <li><strong>Heavy Alcohol Consumption:</strong> Binge drinking or chronic alcohol abuse.</li>
                <li><strong>Certain Medications.</strong></li>
                <li><strong>High Triglyceride Levels</strong> in the blood.</li>
                <li><strong>Abdominal Injury or Surgery.</strong></li>
                <li><strong>Infections</strong>, such as mumps.</li>
                <li><strong>Cystic Fibrosis.</strong></li>
                <li><strong>Pancreatic or bile duct abnormalities.</strong></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <HeartPulse className="h-6 w-6 mr-2 text-accent" /> Symptoms and Severity
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Symptoms of acute pancreatitis usually develop quickly and can include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 leading-relaxed">
                <li><strong>Severe Upper Abdominal Pain:</strong> Often sudden in onset, may radiate to the back, and can be constant and intense.</li>
                <li><strong>Nausea and Vomiting.</strong></li>
                <li><strong>Fever and Chills.</strong></li>
                <li><strong>Rapid Pulse.</strong></li>
                <li><strong>Swollen and Tender Abdomen.</strong></li>
              </ul>
              <p className="text-foreground/90 leading-relaxed mt-2">
                The severity can vary. Mild cases may resolve with supportive care, while severe cases can lead to serious complications like pancreatic necrosis (tissue death), infection, pseudocyst formation, and multi-organ failure.
              </p>
              <p className="mt-4 text-sm text-destructive font-medium">
                Acute pancreatitis is a medical emergency. Seek immediate medical attention if you experience symptoms.
              </p>
            </section>
             <p className="text-xs text-muted-foreground text-center pt-4">
              This information is for educational purposes only and does not substitute professional medical advice.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
