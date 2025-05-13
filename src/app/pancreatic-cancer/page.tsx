'use client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ribbon, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import Image from 'next/image';

export default function PancreaticCancerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Ribbon className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
              Understanding Pancreatic Cancer
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              An overview of one of the most challenging forms of cancer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-destructive" /> What is Pancreatic Cancer?
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Pancreatic cancer is a disease in which malignant (cancerous) cells form in the tissues of the pancreas.
                The pancreas is an organ located behind the stomach that plays an essential role in digestion by producing enzymes and hormones like insulin.
                It is often detected at a late stage, making it particularly dangerous and difficult to treat.
              </p>
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <Image
                    src="https://picsum.photos/600/300?random=1"
                    alt="Pancreas anatomy illustration"
                    width={600}
                    height={300}
                    className="rounded-md mx-auto shadow-md"
                    data-ai-hint="pancreas anatomy"
                />
                <p className="text-xs text-center text-muted-foreground mt-2">Illustrative image of the pancreas.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <Activity className="h-6 w-6 mr-2 text-primary" /> How it Affects People
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Pancreatic cancer can significantly impact a person's quality of life. As the tumor grows, it can interfere with the pancreas's ability to produce digestive enzymes, leading to malabsorption and weight loss. It can also affect insulin production, potentially causing diabetes. The spread of cancer to nearby organs or distant sites further complicates treatment and worsens prognosis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <ShieldCheck className="h-6 w-6 mr-2 text-accent" /> Common Symptoms
              </h2>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 leading-relaxed">
                <li><strong>Jaundice:</strong> Yellowing of the skin and eyes, dark urine, pale stools.</li>
                <li><strong>Abdominal or Back Pain:</strong> Often a dull ache that may radiate to the back.</li>
                <li><strong>Unexplained Weight Loss and Loss of Appetite.</strong></li>
                <li><strong>Changes in Bowel Habits:</strong> Such as diarrhea or constipation.</li>
                <li><strong>Nausea and Vomiting.</strong></li>
                <li><strong>Fatigue and Weakness.</strong></li>
                <li><strong>New-Onset Diabetes:</strong> Especially in older adults, or sudden difficulty controlling existing diabetes.</li>
              </ul>
              <p className="mt-4 text-sm text-destructive font-medium">
                If you experience persistent symptoms, it's crucial to consult a healthcare professional for proper diagnosis and guidance.
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
