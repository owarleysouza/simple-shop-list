import { LoaderCircle } from 'lucide-react';

const LoadingComponent = () => {
  return (
    <div className="w-full h-80 pa-0 flex flex-col items-center justify-center space-y-2">
      <LoaderCircle className="text-primary animate-spin" />
    </div>
  );
};

export default LoadingComponent;
