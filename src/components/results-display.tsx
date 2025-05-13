'use client';

import { BarChartBig, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import type { AnalyzePancreasScanOutput } from '@/ai/flows/analyze-pancreas-scan';

interface ResultsDisplayProps {
  analysisResult: AnalyzePancreasScanOutput | null;
}

interface DiseaseData {
  name: string;
  displayName: string;
  probability: number;
  color: string;
}

const diseaseConfig: Record<keyof AnalyzePancreasScanOutput, { displayName: string, colorVariable: string }> = {
  pancreaticCancerProbability: { displayName: 'Pancreatic Cancer', colorVariable: '--chart-1' },
  chronicPancreatitisProbability: { displayName: 'Chronic Pancreatitis', colorVariable: '--chart-2' },
  pancreaticCystsProbability: { displayName: 'Pancreatic Cysts', colorVariable: '--chart-3' },
  acutePancreatitisProbability: { displayName: 'Acute Pancreatitis', colorVariable: '--chart-4' },
};

export function ResultsDisplay({ analysisResult }: ResultsDisplayProps) {
  if (!analysisResult) {
    return null;
  }

  const diseaseProbabilities: DiseaseData[] = Object.entries(analysisResult)
    .map(([key, probability]) => {
      const config = diseaseConfig[key as keyof AnalyzePancreasScanOutput];
      return {
        name: key,
        displayName: config.displayName,
        probability: Number(probability) * 100, // Convert to percentage
        color: `hsl(var(${config.colorVariable}))`,
      };
    })
    .sort((a, b) => b.probability - a.probability); // Sort by probability descending

  const sortedForMinMax = [...diseaseProbabilities].sort((a, b) => a.probability - b.probability);
  const leastLikely = sortedForMinMax[0];
  const mostLikely = sortedForMinMax[sortedForMinMax.length - 1];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-md shadow-lg">
          <p className="label text-foreground">{`${label} : ${payload[0].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  const hasSignificantFinding = diseaseProbabilities.some(d => d.probability > 50);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChartBig className="w-8 h-8 text-primary" />
          <CardTitle className="text-2xl text-primary">Analysis Results</CardTitle>
        </div>
        <CardDescription>
          The AI has analyzed the scan for signs of common pancreatic diseases. 
          Probabilities are shown below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground">Probability Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseProbabilities} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="displayName" 
                  tickFormatter={(value) => value.split(' ').map((s: string) => s.substring(0,3)).join(' ')} // Abbreviate for space
                  angle={-15}
                  textAnchor="end"
                  height={50}
                  interval={0}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }} />
                <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
                  {diseaseProbabilities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-secondary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-green-600 dark:text-green-400">
                <TrendingDown className="w-5 h-5" />
                Least Likely
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg">{leastLikely.displayName}</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{leastLikely.probability.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
                <TrendingUp className="w-5 h-5" />
                Most Likely
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg">{mostLikely.displayName}</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{mostLikely.probability.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>
        
        {hasSignificantFinding && mostLikely.probability > 50 && (
           <div className="flex items-start p-4 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded-md border border-amber-300 dark:border-amber-700">
              <AlertTriangle className="w-6 h-6 mr-3 shrink-0 mt-0.5 text-amber-500 dark:text-amber-400" />
              <div>
                <p className="font-semibold">Important Note:</p>
                <p>The analysis indicates a notable probability for {mostLikely.displayName}. This tool provides preliminary insights and is not a substitute for professional medical diagnosis. Please consult a qualified healthcare professional for further evaluation and advice.</p>
              </div>
            </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-4">
          Disclaimer: These results are generated by an AI model and should be used for informational purposes only. Always consult with a qualified medical professional for diagnosis and treatment.
        </div>
      </CardContent>
    </Card>
  );
}
