import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Zap, Shield } from "lucide-react";

const features = [
  {
    title: "Lightning Fast",
    description: "Built with performance in mind for the best user experience",
    icon: Zap,
  },
  {
    title: "Beautiful Design",
    description: "Modern and clean interface that looks great on any device",
    icon: Sparkles,
  },
  {
    title: "Secure & Reliable",
    description: "Enterprise-grade security to keep your data safe",
    icon: Shield,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Amazing Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;