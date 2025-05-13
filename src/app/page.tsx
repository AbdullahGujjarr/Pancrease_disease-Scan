
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ImageUploadForm } from '@/components/image-upload-form';
import { ResultsDisplay } from '@/components/results-display';
import { performImageAnalysis, type AnalysisFormState } from '@/app/actions';
import type { AnalyzePancreasScanOutput } from '@/ai/flows/analyze-pancreas-scan';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { RefreshCcw, Download } from 'lucide-react';
import { generateReportPDF } from '@/lib/pdf-utils';
import { Chatbot } from '@/components/chatbot'; // Import Chatbot

export default function PancreasVisionPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzePancreasScanOutput | null>(null);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [appState, setAppState] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [mostLikelyForPdf, setMostLikelyForPdf] = useState<{name: string, probability: number} | null>(null);


  const { toast } = useToast();

  const handleAnalysisStart = () => {
    setAppState('analyzing');
    setAnalysisResult(null);
    setCurrentError(null);
  };

  const handleAnalysisComplete = (formState: AnalysisFormState) => {
    if (formState.data) {
      setAnalysisResult(formState.data);
      setCurrentError(null);
      setAppState('results');
      if (formState.message) {
        toast({
          title: 'Analysis Complete',
          description: formState.message,
        });
      }
    } else if (formState.error) {
      setCurrentError(formState.error);
      setAnalysisResult(null);
      setAppState('upload'); 
    } else {
      setAppState('upload');
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setCurrentError(null);
    setAppState('upload');
    setMostLikelyForPdf(null);
  };

  const handleDownloadPdf = useCallback(() => {
    if (analysisResult) {
      generateReportPDF(analysisResult, mostLikelyForPdf);
      toast({
        title: "Report Downloaded",
        description: "Your PDF report has started downloading.",
      });
    }
  }, [analysisResult, mostLikelyForPdf, toast]);
  
  useEffect(() => {
    if (currentError && appState === 'upload') {
      // Toasting is handled within ImageUploadForm for form-specific errors.
    }
  }, [currentError, appState, toast]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <section className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
            Welcome to Pancreas Vision
          </h1>
          <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
            Leverage AI to analyze pancreas scans for early detection of potential diseases. 
            Upload an image to begin.
          </p>
        </section>

        {appState !== 'results' && (
           <ImageUploadForm
            formAction={performImageAnalysis}
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
            allowNewUpload={false} 
            onReset={() => {}} 
          />
        )}
        
        {appState === 'results' && analysisResult && (
          <>
            <ResultsDisplay 
              analysisResult={analysisResult} 
              onMostLikelyDetermined={(condition) => setMostLikelyForPdf(condition)}
            />
            <div className="mt-8 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button onClick={handleReset} variant="outline" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <RefreshCcw className="mr-2 h-5 w-5" />
                Analyze Another Scan
              </Button>
              <Button onClick={handleDownloadPdf} variant="default" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="mr-2 h-5 w-5" />
                Download PDF Report
              </Button>
            </div>
          </>
        )}
         {appState === 'analyzing' && !analysisResult && (
          <div className="text-center py-10">
            <div role="status" className="flex flex-col items-center">
                <svg aria-hidden="true" className="w-12 h-12 text-muted-foreground animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="text-xl font-medium text-muted-foreground mt-4">Analyzing your scan...</span>
                <p className="text-sm text-muted-foreground">This may take a few moments.</p>
            </div>
          </div>
        )}

        <Chatbot /> {/* Add Chatbot component here */}

      </main>
      <Footer />
    </div>
  );
}
