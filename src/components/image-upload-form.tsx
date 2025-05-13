'use client';

import { useState, useCallback, useEffect, type ChangeEvent, type DragEvent, useRef } from 'react';
import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { UploadCloud, FileImage, XCircle, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type { performImageAnalysis, AnalysisFormState } from '@/app/actions'; 

interface ImageUploadFormProps {
  formAction: (prevState: AnalysisFormState | null, formData: FormData) => Promise<AnalysisFormState>; 
  onAnalysisStart: () => void;
  onAnalysisComplete: (data: AnalysisFormState) => void; 
  allowNewUpload: boolean; // This prop seems to control if the form is for a new upload or showing "Analyze Another"
  onReset: () => void;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

interface SubmitButtonProps {
  allowNewUpload: boolean;
  onReset: () => void; // Used when allowNewUpload is true
  // onAnalysisStart is implicitly handled by useFormStatus for the main submit
  disableSubmit: boolean; // Used when allowNewUpload is false
}

function SubmitButton({
  allowNewUpload,
  onReset,
  disableSubmit,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  // onAnalysisStart is called by the parent component when formAction is invoked.

  if (allowNewUpload) { // This button appears when results are shown, to start a new analysis
    return (
      <Button
        type="button" 
        onClick={onReset} // This resets the page state for a new upload
        variant="outline"
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        suppressHydrationWarning
      >
        <RefreshCcw className="mr-2 h-4 w-4" /> Analyze Another Image
      </Button>
    );
  }

  // This is the main submit button for the initial analysis
  return (
    <Button
      type="submit"
      disabled={pending || disableSubmit}
      className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
      suppressHydrationWarning // Added for potential browser extension interference
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
        </>
      ) : (
        'Analyze Pancreas Scan'
      )}
    </Button>
  );
}

export function ImageUploadForm({ formAction, onAnalysisStart, onAnalysisComplete, allowNewUpload, onReset }: ImageUploadFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // `state` is the result from the server action, `dispatch` calls the action
  const [state, dispatch] = useActionState(formAction, null); 

  // Effect to handle server action completion
  useEffect(() => {
    if (state) { // state will be null initially, then populated after action
      onAnalysisComplete(state); // Pass the full state (data, error, message) to parent
      if (state.error) {
        toast({
          title: 'Analysis Error',
          description: state.error,
          variant: 'destructive',
        });
      }
      // Success messages (state.message) are handled by the parent page.tsx
    }
  }, [state, toast, onAnalysisComplete]);


  const handleFileChange = (file: File | null) => {
    // This function should only run if we are in the initial upload phase, not when "Analyze Another" is shown
    if (allowNewUpload) return; 

    setFileError(null);
    setPreview(null);
    setFileName(null);
    setDataUri(null);
    setUploadProgress(0);

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFileError('Invalid file type. Please upload a JPG or PNG image.');
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      };
      
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setDataUri(reader.result as string); // This will be submitted
        setUploadProgress(100);
      };
      reader.onerror = () => {
        setFileError('Error reading file.');
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files ? e.target.files[0] : null);
  };

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (allowNewUpload) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [allowNewUpload]); // Added allowNewUpload to dependencies

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (allowNewUpload) return;
    setIsDragging(true);
  }, [allowNewUpload]); // Added allowNewUpload

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (allowNewUpload) return;
    setIsDragging(false);
  }, [allowNewUpload]); // Added allowNewUpload

  const removePreview = () => {
    setPreview(null);
    setFileName(null);
    setDataUri(null);
    setFileError(null);
    setUploadProgress(0);
    if (formRef.current) {
        // Reset visual file input if direct DOM manipulation is necessary,
        // though ideally state drives this.
        const fileInput = formRef.current.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }
  };
  
  const handleSubmit = (formData: FormData) => {
    if (!dataUri && !allowNewUpload) {
      setFileError("Please select an image file to analyze.");
      return;
    }
    if (allowNewUpload) { // This case should be handled by the "Analyze Another" button's onReset
        return;
    }
    
    // Ensure dataUri is added to formData if it's not already (it should be via hidden input)
    if (dataUri && !formData.has('scanDataUri')) {
        formData.append('scanDataUri', dataUri);
    }
    
    onAnalysisStart(); // Signal parent that analysis is starting
    dispatch(formData); // Call the server action
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Upload Pancreas Scan</CardTitle>
        <CardDescription>
          Upload a JPG or PNG image of a pancreas scan (max {MAX_FILE_SIZE_MB}MB). 
          <br />
          <span className="text-xs text-muted-foreground">Note: DICOM files may need conversion to JPG/PNG first.</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* The form's action prop now correctly uses the dispatch from useActionState */}
        <form action={handleSubmit} ref={formRef} className="space-y-6">
          {/* Hidden input to pass dataUri with FormData. It's crucial this is inside the form. */}
          {dataUri && <input type="hidden" name="scanDataUri" value={dataUri} />}

          {!preview && !allowNewUpload && ( // Only show upload area if no preview and not in "results" state (allowNewUpload=false)
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer
                ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}
                transition-colors duration-200 ease-in-out`}
            >
              <UploadCloud className={`w-12 h-12 mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <Label htmlFor="scanFileVisualInput" className="text-center">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG (MAX. {MAX_FILE_SIZE_MB}MB)</p>
              </Label>
              {/* This input is for user interaction; its value isn't directly submitted if dataUri is used. */}
              <Input id="scanFileVisualInput" name="scanFileVisual" type="file" className="hidden" onChange={onFileInputChange} accept={ALLOWED_FILE_TYPES.join(',')} />
            </div>
          )}

          {fileError && (
            <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              <XCircle className="w-5 h-5 mr-2" />
              {fileError}
            </div>
          )}

          {preview && !allowNewUpload && ( // Only show preview if there is one and not in "results" state
            <div className="space-y-3">
              <div className="relative group aspect-video w-full rounded-md overflow-hidden border border-muted">
                <Image src={preview} alt={fileName || "Scan preview"} layout="fill" objectFit="contain" data-ai-hint="medical scan"/>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/70 hover:bg-destructive/80 hover:text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={removePreview}
                  aria-label="Remove image"
                  suppressHydrationWarning // Added for potential browser extension interference
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <FileImage className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">{fileName}</span>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                 <Progress value={uploadProgress} className="w-full h-2" />
              )}
               {uploadProgress === 100 && dataUri && (
                <p className="text-xs text-green-600">Image ready for analysis.</p>
              )}
            </div>
          )}
          
          <div className="pt-2">
            {/* SubmitButton's behavior changes based on allowNewUpload */}
            <SubmitButton
              allowNewUpload={allowNewUpload}
              onReset={onReset} // onReset is for the "Analyze Another" button scenario
              disableSubmit={!dataUri && !allowNewUpload} // disable main submit if no dataUri
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
