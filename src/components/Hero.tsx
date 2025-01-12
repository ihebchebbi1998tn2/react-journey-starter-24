import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="min-h-screen pt-16 flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-white animate-gradient-y -z-10" />
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to Your Next App
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Build something amazing with modern web technologies and beautiful design
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
            Get Started
          </Button>
          <Button variant="outline" className="text-lg px-8 py-6">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;