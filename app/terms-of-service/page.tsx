import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | Ceylon Workforce",
  description: "Terms and conditions for using the Ceylon Workforce platform",
}

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last Updated: May 2, 2025</p>
        </div>

        <div className="prose max-w-none">
          <p>
            Welcome to Ceylon Workforce. Please read these Terms of Service ("Terms") carefully as they contain
            important information about your legal rights, remedies, and obligations. By accessing or using the Ceylon
            Workforce platform, you agree to comply with and be bound by these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By registering for and/or using the Service in any manner, you agree to these Terms and all other operating
            rules, policies, and procedures that may be published by Ceylon Workforce, which are incorporated by
            reference.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
          <p>
            You must be at least 18 years of age to use the Service. By using the Service, you represent and warrant
            that you meet all eligibility requirements outlined in these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Registration</h2>
          <p>
            To access certain features of the Service, you must register for an account. You agree to provide accurate,
            current, and complete information during the registration process and to update such information to keep it
            accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your password and for all activities that occur under your account. You
            agree to notify Ceylon Workforce immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Types and Services</h2>
          <p>Ceylon Workforce offers services for both job seekers and employers:</p>
          <ul className="list-disc pl-6 my-4">
            <li>
              <strong>Job Seekers:</strong> Can create profiles, browse job listings, apply to jobs, and communicate
              with potential employers.
            </li>
            <li>
              <strong>Employers:</strong> Can post job listings, search for candidates, review applications, and
              communicate with potential employees.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Content</h2>
          <p>
            You retain ownership of any content you submit, post, or display on or through the Service ("User Content").
            By submitting User Content, you grant Ceylon Workforce a worldwide, non-exclusive, royalty-free license to
            use, reproduce, modify, adapt, publish, translate, and distribute such content.
          </p>
          <p>
            You represent and warrant that: (i) you own the User Content or have the right to use and grant us the
            rights and license as provided in these Terms, and (ii) the posting of your User Content does not violate
            the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Prohibited Activities</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Using the Service for any illegal purpose or in violation of any laws</li>
            <li>Posting false or misleading information</li>
            <li>Impersonating any person or entity</li>
            <li>Interfering with or disrupting the Service</li>
            <li>Attempting to gain unauthorized access to the Service</li>
            <li>Harassing, threatening, or intimidating other users</li>
            <li>Posting discriminatory or offensive content</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Payment Terms</h2>
          <p>
            Certain aspects of the Service may be subject to fees. You agree to pay all applicable fees as described on
            the Service. All payments are non-refundable except as required by law or as explicitly stated in these
            Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Termination</h2>
          <p>
            Ceylon Workforce reserves the right to suspend or terminate your access to the Service at any time, with or
            without cause, and with or without notice. Upon termination, your right to use the Service will immediately
            cease.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
            IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, OR NON-INFRINGEMENT.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL CEYLON WORKFORCE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE
            LOSSES.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Ceylon Workforce and its officers, directors, employees, and
            agents, from and against any claims, disputes, demands, liabilities, damages, losses, and expenses,
            including, without limitation, reasonable legal and accounting fees arising out of or in any way connected
            with your access to or use of the Service or your violation of these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to
            its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Changes to Terms</h2>
          <p>
            Ceylon Workforce reserves the right to modify or replace these Terms at any time. If a revision is material,
            we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material
            change will be determined at our sole discretion.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">14. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p className="mt-2">
            <strong>Email:</strong> legal@ceylonworkforce.com
            <br />
            <strong>Address:</strong> 123 Temple Road, Colombo, Sri Lanka
          </p>
        </div>

        <div className="border-t pt-8 mt-12">
          <p className="text-sm text-gray-600">
            By using Ceylon Workforce, you acknowledge that you have read, understood, and agree to be bound by these
            Terms of Service.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
