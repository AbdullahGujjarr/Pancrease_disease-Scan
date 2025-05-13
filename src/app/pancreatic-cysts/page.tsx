'use client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, ShieldAlert, Microscope, HelpCircle } from 'lucide-react';
import Image from 'next/image';

export default function PancreaticCystsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader className="text-center">
             <div className="flex justify-center items-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary lucide lucide-atom"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><circle cx="12" cy="12" r="3"/><path d="M12 12s4.6-7.61 6-9"/><path d="M12 12s-4.67 7.32-6 9"/><path d="M12 12s7.61 4.6 9 6"/><path d="M12 12s-7.32-4.67-9-6"/></svg>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
              Understanding Pancreatic Cysts
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Fluid-filled sacs on or in the pancreas, ranging from benign to potentially cancerous.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <HelpCircle className="h-6 w-6 mr-2 text-destructive" /> What are Pancreatic Cysts?
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Pancreatic cysts are sac-like pockets of fluid on or in your pancreas. They are relatively common and often discovered incidentally during imaging tests for other conditions. While many pancreatic cysts are benign (non-cancerous) and may not require treatment, some have the potential to become cancerous or are already cancerous. Therefore, careful evaluation and monitoring are often necessary.
              </p>
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <Image
                    src="https://picsum.photos/600/300?random=3"
                    alt="Medical image showing pancreatic cysts"
                    width={600}
                    height={300}
                    className="rounded-md mx-auto shadow-md"
                    data-ai-hint="pancreatic cyst"
                />
                <p className="text-xs text-center text-muted-foreground mt-2">Example of cysts visualized on a medical scan.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <Microscope className="h-6 w-6 mr-2 text-primary" /> Types and Risks
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                There are various types of pancreatic cysts. Some, like pseudocysts, are usually benign and often result from pancreatitis. Others, such as serous cystadenomas, are typically benign. However, mucinous cysts (e.g., intraductal papillary mucinous neoplasms - IPMNs, and mucinous cystic neoplasms - MCNs) carry a risk of becoming malignant. The size, location, and specific features of the cyst help determine its type and potential risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <ShieldAlert className="h-6 w-6 mr-2 text-accent" /> Common Symptoms
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Many pancreatic cysts, especially small ones, do not cause any symptoms. When symptoms do occur, they can include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 leading-relaxed">
                <li>Persistent abdominal pain, which may radiate to the back.</li>
                <li>Nausea and vomiting.</li>
                <li>A feeling of fullness or a palpable mass in the upper abdomen (if the cyst is large).</li>
                <li>Unexplained weight loss.</li>
                <li>Jaundice (if the cyst presses on the bile duct).</li>
                <li>Symptoms of pancreatitis if the cyst causes inflammation.</li>
              </ul>
              <p className="mt-4 text-sm text-destructive font-medium">
                If pancreatic cysts are detected, follow-up with a specialist is important to assess risk and determine the appropriate management plan, which may range from observation to surgical removal.
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
