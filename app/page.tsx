import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowRight, Briefcase, Search, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-32">
      {/* Hero Section */}
      <section className="relative bg-primaryDark text-white py-36 overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 z-0 flex flex-wrap justify-center items-center gap-8 opacity-30  ">
          <img src="/hero 1.png" className="rounded-2xl w-60 h-auto" alt="Hero 1" />
          <img src="/hero2.png" className="rounded-2xl w-60 h-auto" alt="Hero 2" />
          <img src="/hero3.png" className="rounded-2xl w-60 h-auto" alt="Hero 3" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Connect with Sri Lanka's Top Talent</h1>
            <p className="text-lg md:text-xl mb-8 text-subtle">
              The premier platform for job seekers and employers in Sri Lanka
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="lg" size="lg" className="bg-accent hover:bg-accent/90 text-white">
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-accent text-3xl font-bold mb-2">5,000+</div>
            <div className="text-primaryDark">Active Job Seekers</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-accent text-3xl font-bold mb-2">1,200+</div>
            <div className="text-primaryDark">Employers</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-accent text-3xl font-bold mb-2">3,500+</div>
            <div className="text-primaryDark">Successful Placements</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primaryDark">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-accent p-3 rounded-full text-white mr-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold text-primaryDark">For Job Seekers</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-subtle rounded-full p-1 mr-3 mt-1">
                  <span className="block w-4 h-4 bg-accent rounded-full"></span>
                </div>
                <span>Create your profile and showcase your skills</span>
              </li>
              <li className="flex items-start">
                <div className="bg-subtle rounded-full p-1 mr-3 mt-1">
                  <span className="block w-4 h-4 bg-accent rounded-full"></span>
                </div>
                <span>Browse and apply to relevant job opportunities</span>
              </li>
              <li className="flex items-start">
                <div className="bg-subtle rounded-full p-1 mr-3 mt-1">
                  <span className="block w-4 h-4 bg-accent rounded-full"></span>
                </div>
                <span>Connect directly with employers through our chat system</span>
              </li>
            </ul>
            <Button asChild className="mt-6 bg-accent hover:bg-accent/90 text-white">
              <Link href="/register">
                Register as Job Seeker <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-accent p-3 rounded-full text-white mr-4">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-semibold text-primaryDark">For Employers</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-subtle rounded-full p-1 mr-3 mt-1">
                  <span className="block w-4 h-4 bg-accent rounded-full"></span>
                </div>
                <span>Post job openings and reach qualified candidates</span>
              </li>
              <li className="flex items-start">
                <div className="bg-subtle rounded-full p-1 mr-3 mt-1">
                  <span className="block w-4 h-4 bg-accent rounded-full"></span>
                </div>
                <span>Search our database of pre-screened talent</span>
              </li>
              <li className="flex items-start">
                <div className="bg-subtle rounded-full p-1 mr-3 mt-1">
                  <span className="block w-4 h-4 bg-accent rounded-full"></span>
                </div>
                <span>Schedule interviews through chats and manage hiring through our platform</span>
              </li>
            </ul>
            <Button asChild className="mt-6 bg-accent hover:bg-accent/90 text-white">
              <Link href="/register">
                Register as Employer <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4">
        <Tabs defaultValue="jobs" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primaryDark">Featured Listings</h2>
            <TabsList>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="seekers">Talent</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((job) => (
                <Card key={job} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-primaryDark">Senior Software Engineer</CardTitle>
                    <CardDescription>Colombo, Sri Lanka • Full-time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      We're looking for an experienced software engineer to join our growing team...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-subtle/50 text-secondaryDark text-xs px-2 py-1 rounded">React</span>
                      <span className="bg-subtle/50 text-secondaryDark text-xs px-2 py-1 rounded">Node.js</span>
                      <span className="bg-subtle/50 text-secondaryDark text-xs px-2 py-1 rounded">TypeScript</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/register">View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
                <Link href="/register">
                  View All Jobs <Search className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="seekers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((seeker) => (
                <Card key={seeker} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-primaryDark">Full Stack Developer</CardTitle>
                    <CardDescription>Kandy, Sri Lanka • 5 years exp.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Experienced developer with a strong background in web applications and cloud services...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-subtle/50 text-secondaryDark text-xs px-2 py-1 rounded">JavaScript</span>
                      <span className="bg-subtle/50 text-secondaryDark text-xs px-2 py-1 rounded">AWS</span>
                      <span className="bg-subtle/50 text-secondaryDark text-xs px-2 py-1 rounded">MongoDB</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/register">View Profile</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
                <Link href="/register">
                  View All Talent <Search className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="bg-secondaryDark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career or Business?</h2>
          <p className="text-lg mb-8 max-w2xl mx-auto">
            Join Ceylon Work Force today and connect with the best opportunities and talent in the region.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white">
            <Link href="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
