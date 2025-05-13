'use client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Apple, Droplets, Weight, CigaretteOff, WineOff, Activity } from 'lucide-react';

export default function PreventionPage() {
  const preventionActions = [
    {
      icon: <Apple className="h-8 w-8 text-green-500" />,
      title: 'Maintain a Healthy Diet',
      description: 'Focus on a diet rich in fruits, vegetables, whole grains, and lean proteins. Limit intake of red and processed meats, sugary drinks, and high-fat foods, as these can increase the risk of various pancreatic issues and overall metabolic stress.',
    },
    {
      icon: <Weight className="h-8 w-8 text-blue-500" />,
      title: 'Maintain a Healthy Weight',
      description: 'Obesity is a significant risk factor for pancreatic cancer and can also contribute to conditions like gallstones, which may lead to acute pancreatitis. Aim for a healthy Body Mass Index (BMI) through balanced diet and regular exercise.',
    },
    {
      icon: <CigaretteOff className="h-8 w-8 text-red-500" />,
      title: 'Avoid Smoking and Tobacco Products',
      description: 'Smoking is one of the most critical modifiable risk factors for pancreatic cancer and chronic pancreatitis. Quitting smoking can significantly reduce your risk. Seek support if you need help to quit.',
    },
    {
      icon: <WineOff className="h-8 w-8 text-purple-500" />,
      title: 'Limit Alcohol Consumption',
      description: 'Heavy alcohol use is a primary cause of chronic pancreatitis and a risk factor for acute pancreatitis. If you choose to drink, do so in moderation (up to one drink per day for women and up to two drinks per day for men).',
    },
    {
      icon: <Droplets className="h-8 w-8 text-teal-500" />, // Could use a diabetes specific icon if available
      title: 'Manage Diabetes',
      description: 'Poorly controlled diabetes, or new-onset diabetes in adults, can be associated with an increased risk of pancreatic cancer. Effective diabetes management, including blood sugar control, is important.',
    },
    {
      icon: <Activity className="h-8 w-8 text-orange-500" />,
      title: 'Regular Physical Activity',
      description: 'Engaging in regular physical activity helps maintain a healthy weight, improves insulin sensitivity, and reduces overall inflammation, all of which can contribute to better pancreatic health.',
    },
     {
      icon: <ShieldCheck className="h-8 w-8 text-indigo-500" />,
      title: 'Regular Medical Check-ups',
      description: 'Attend regular check-ups with your healthcare provider, especially if you have a family history of pancreatic diseases or other risk factors. Discuss any persistent or concerning symptoms promptly.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-4xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
              Preventing Pancreatic Diseases
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Lifestyle choices and proactive health management can significantly reduce the risk of developing pancreatic conditions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 mt-6">
            <p className="text-lg text-foreground/90 leading-relaxed text-center">
              While not all pancreatic diseases can be prevented, adopting healthy habits can lower your risk. Here are some internationally recognized guidelines:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preventionActions.map((action, index) => (
                <Card key={index} className="bg-secondary/30 hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4 pb-3">
                    {action.icon}
                    <CardTitle className="text-xl text-primary">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 p-4 bg-accent/10 border border-accent/30 rounded-lg text-center">
              <p className="text-accent-foreground font-semibold">
                Disclaimer: These recommendations are for general informational purposes. Always consult with a healthcare professional for personalized medical advice and screening recommendations based on your individual health status and risk factors.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
