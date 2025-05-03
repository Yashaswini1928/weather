import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({ 
  message = "Unable to load weather data", 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="bg-error bg-opacity-10 border-l-4 border-error text-error p-4 rounded">
      <div className="flex items-start">
        <span className="material-icons mr-2">error_outline</span>
        <div>
          <h3 className="font-bold">{message}</h3>
          <p>Please check your connection or try again later.</p>
          <Button 
            variant="default" 
            onClick={onRetry}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
