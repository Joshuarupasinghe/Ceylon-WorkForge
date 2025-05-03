import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-12 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primaryDark mb-4">About Ceylon Work Force</h1>
          <p className="text-xl text-muted-foreground">Connecting talent with opportunity in Ceylon</p>
        </div>

        <Tabs defaultValue="mission" className="w-auto mb-16">
          <TabsList className="grid w-max grid-cols-3 bg-white  hover:bg-accent/90">
            <TabsTrigger value="mission">Our Mission</TabsTrigger>
            <TabsTrigger value="team">Our Team</TabsTrigger>
            <TabsTrigger value="story">Our Story</TabsTrigger>
          </TabsList>
          <TabsContent value="mission" className="p-6 bg-white rounded-lg shadow-sm mt-4">
            <h2 className="text-2xl font-bold text-primaryDark mb-4">Our Mission</h2>
            <p className="mb-4">
              At Ceylon Work Force, our mission is to bridge the gap between talented professionals and quality
              employment opportunities across Ceylon. We believe that the right match between employers and job seekers
              creates prosperity for individuals, businesses, and communities.
            </p>
            <p className="mb-4">
              We're committed to creating a transparent, efficient, and accessible platform that empowers both job
              seekers and employers to make informed decisions about their careers and hiring needs.
            </p>
            <p>
              Through innovative technology and personalized service, we aim to transform the recruitment landscape in
              Ceylon and contribute to the economic growth of our nation.
            </p>
          </TabsContent>
          <TabsContent value="team" className="p-6 bg-white rounded-lg shadow-sm mt-4">
            <h2 className="text-2xl font-bold text-primaryDark mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src="/professional-ceo-portrait.png" alt="CEO portrait" fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">Rajiv Mendis</h3>
                  <p className="text-sm text-muted-foreground">Founder & CEO</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src="/professional-cto-portrait.png" alt="CTO portrait" fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">Amara Perera</h3>
                  <p className="text-sm text-muted-foreground">CTO</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src="/professional-coo-portrait.png" alt="COO portrait" fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">Dinesh Kumar</h3>
                  <p className="text-sm text-muted-foreground">COO</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="story" className="p-6 bg-white rounded-lg shadow-sm mt-4">
            <h2 className="text-2xl font-bold text-primaryDark mb-4">Our Story</h2>
            <p className="mb-4">
              Ceylon Work Force was founded in 2022 by Rajiv Mendis, who experienced firsthand the challenges of
              connecting qualified talent with the right opportunities in Ceylon's growing economy.
            </p>
            <p className="mb-4">
              What began as a small job board has evolved into a comprehensive platform that serves thousands of job
              seekers and hundreds of employers across the country. Our growth has been driven by our commitment to
              understanding the unique needs of the Ceylon job market and developing solutions that address those needs.
            </p>
            <p>
              Today, we're proud to be Ceylon's leading employment platform, and we continue to innovate and expand our
              services to better serve our community of users.
            </p>
          </TabsContent>
        </Tabs>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-primaryDark mb-6">How Ceylon Work Force Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up as a job seeker or employer and create a detailed profile that showcases your skills or company.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Connect</h3>
              <p className="text-muted-foreground">
                Browse through job listings or candidate profiles and connect with potential matches.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Collaborate</h3>
              <p className="text-muted-foreground">
                Use our platform to communicate, schedule interviews, and finalize employment arrangements.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primaryDark text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">Join thousands of professionals and companies on Ceylon Work Force today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md font-medium">
              Create an Account
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-white/90 text-primaryDark px-6 py-3 rounded-md font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
