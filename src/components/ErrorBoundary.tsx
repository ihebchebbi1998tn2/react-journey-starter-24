import React, { Component, ErrorInfo } from 'react';
import { toast } from "@/components/ui/use-toast";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Show error toast to user
    toast({
      title: "Une erreur s'est produite",
      description: "Retour à la page précédente...",
      variant: "destructive",
    });

    // Go back to previous page after a short delay
    setTimeout(() => {
      window.history.back();
      // Reset error state
      this.setState({ hasError: false });
    }, 1500);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center p-8">
            <p className="text-lg text-gray-600">Redirection en cours...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}