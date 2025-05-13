'use client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ShieldAlert, HeartCrack, ListChecks } from 'lucide-react';
import Image from 'next/image';

export default function ChronicPancreatitisPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary lucide lucide-flame-kindling"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Z"/><path d="M12 20a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Z"/><path d="M12 18a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Z"/><path d="m9.5 12.5 5-5"/><path d="m14.5 12.5-5-5"/><path d="M12 14a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1"/><path d="M12 4a8.1 8.1 0 0 0-4.2 11.83A5 5 0 0 0 12 22a5 5 0 0 0 4.2-6.17A8.1 8.1 0 0 0 12 4Z"/></svg>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
              Understanding Chronic Pancreatitis
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              A persistent inflammation of the pancreas leading to long-term damage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <ShieldAlert className="h-6 w-6 mr-2 text-destructive" /> What is Chronic Pancreatitis?
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Chronic pancreatitis is a long-standing inflammation of the pancreas that results in irreversible damage. Unlike acute pancreatitis, which is a sudden inflammation, chronic pancreatitis involves progressive destruction of pancreatic tissue, leading to scarring and loss of function over time. This condition can severely impair the pancreas's ability to produce digestive enzymes and hormones like insulin.
              </p>
               <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <Image
                    src="https://picsum.photos/600/300?random=2"
                    alt="Illustration of an inflamed pancreas"
                    width={600}
                    height={300}
                    className="rounded-md mx-auto shadow-md"
                    data-ai-hint="inflamed pancreas"
                />
                <p className="text-xs text-center text-muted-foreground mt-2">Visual representation of pancreatic inflammation.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <HeartCrack className="h-6 w-6 mr-2 text-primary" /> How it Affects People
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Living with chronic pancreatitis can be challenging. The persistent inflammation causes ongoing pain, which can be debilitating. The damage to the pancreas impairs digestion, leading to malabsorption of nutrients, weight loss, and diarrhea. Over time, the destruction of insulin-producing cells can result in diabetes. Patients may also face an increased risk of pancreatic cancer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <ListChecks className="h-6 w-6 mr-2 text-accent" /> Common Symptoms
              </h2>
              <ul className="list-disc list-inside space-y-2 text-foreground/90 leading-relaxed">
                <li><strong>Persistent or Recurring Abdominal Pain:</strong> Often severe, may radiate to the back, and can last for hours or days. Pain may worsen after eating.</li>
                <li><strong>Digestive Issues:</strong> Nausea, vomiting, and diarrhea.</li>
                <li><strong>Steatorrhea:</strong> Oily, fatty, foul-smelling stools due to malabsorption of fat.</li>
                <li><strong>Unexplained Weight Loss:</strong> Due to malabsorption and decreased food intake to avoid pain.</li>
                <li><strong>Symptoms of Diabetes:</strong> Such as increased thirst, frequent urination, and fatigue, if insulin production is affected.</li>
              </ul>
              <p className="mt-4 text-sm text-destructive font-medium">
                Early diagnosis and management are crucial to slow disease progression and manage symptoms. Consult a healthcare provider if you have concerning symptoms.
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
