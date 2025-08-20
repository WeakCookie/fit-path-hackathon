import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, Dumbbell, TrendingUp, Users, Clock, Zap, Calendar } from "lucide-react"
import { Link } from "react-router-dom"
import heroImage from "@/assets/hero-basketball.jpg"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-white/30 z-10" />
        
        {/* Bottom fade to blend with content */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
        
        <div className="relative z-20 container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 drop-shadow-sm">
              Achieve your 
              <span className="bg-gradient-to-r from-fitness-orange to-fitness-orange-hover bg-clip-text text-transparent">
                {" "}Peak Athleticism
              </span>
            </h1>
            <p className="text-xl text-black mb-8 leading-relaxed drop-shadow-lg">
              Get personalized workout recommendations and intelligent predictions 
              to optimize your training performance with our advanced AI coach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/training-log">Start Training Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-8 pb-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Intelligent Training Assistant
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of fitness with AI-driven insights that adapt to your unique training style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="p-3 bg-fitness-orange/10 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-fitness-orange" />
                </div>
                <CardTitle className="text-xl">Smart Suggestions</CardTitle>
                <CardDescription>
                  Get AI-powered exercise recommendations tailored to your fitness goals and current performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="p-3 bg-prediction-gray/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-6 w-6 text-prediction-gray" />
                </div>
                <CardTitle className="text-xl">Predictive Analytics</CardTitle>
                <CardDescription>
                  Advanced predictions for your workout intensity, duration, and optimal rest periods
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="p-3 bg-fitness-orange/10 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-fitness-orange" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your fitness journey with detailed analytics and performance insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How FitPath Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to unlock your fitness potential with AI guidance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-r from-fitness-orange to-fitness-orange-hover rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-fitness-orange-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Log Your Workout</h3>
              <p className="text-muted-foreground">
                Input your exercise details including duration, intensity, and rest periods
              </p>
            </div>

            <div className="text-center group">
              <div className="p-4 bg-gradient-to-r from-prediction-gray to-prediction-gray-hover rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-prediction-gray-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get AI Insights</h3>
              <p className="text-muted-foreground">
                Receive intelligent predictions and personalized suggestions for optimal training
              </p>
            </div>

            <div className="text-center group">
              <div className="p-4 bg-gradient-to-r from-fitness-orange to-fitness-orange-hover rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-fitness-orange-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Optimize Performance</h3>
              <p className="text-muted-foreground">
                Apply AI recommendations to improve your training efficiency and results
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Index;
