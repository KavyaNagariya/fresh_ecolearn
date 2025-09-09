import { ContactForm } from "@/components/ui/ContactForm";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Link } from "wouter";

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Transform <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Environmental Education</span>?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join the movement towards sustainable education. Share your feedback or express your interest in bringing EcoLearn to your institution.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Info & Visual */}
            <div className="space-y-8">
              <img 
                src="/imagestobeused/contactforsite.jpg" 
                alt="Students and teachers collaborating on environmental sustainability projects" 
                className="rounded-2xl shadow-lg w-full h-auto"
                onError={(e) => {
                  // Fallback to a solid color background if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden rounded-2xl shadow-lg w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">🌍</div>
                  <div className="text-sm">Environmental Collaboration</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">Connect With Us</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      <div className="text-sm text-muted-foreground">contact@ecolearn.edu</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-secondary to-indigo-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Follow Updates</div>
                      <div className="text-sm text-muted-foreground">@EcoLearnEdu</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Eco Journey?</h3>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of students and educators who are already making a difference through gamified environmental education.
              </p>
              <Link href="/signup">
                <Button 
                  className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-300 text-lg"
                  data-testid="button-join-ecolearn"
                >
                  Join EcoLearn Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
