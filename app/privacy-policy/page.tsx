import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Ceylon Workforce",
  description: "Privacy policy for the Ceylon Workforce platform",
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last Updated: May 2, 2025</p>
        </div>

        <div className="prose max-w-none">
          <p>
            At Ceylon Workforce, we take your privacy seriously. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use our platform. Please read this privacy policy
            carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when you:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Register for an account</li>
            <li>Create or update your profile</li>
            <li>Post jobs or apply for jobs</li>
            <li>Communicate with other users</li>
            <li>Contact our support team</li>
            <li>Respond to surveys or questionnaires</li>
          </ul>

          <p>This information may include:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Personal identifiers (name, email address, phone number)</li>
            <li>Professional information (work history, education, skills)</li>
            <li>Account credentials</li>
            <li>Profile photos</li>
            <li>Payment information</li>
            <li>Communications and correspondence</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information Collected Automatically</h2>
          <p>
            When you access our platform, we may automatically collect certain information about your device and usage,
            including:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, clicks)</li>
            <li>Location information</li>
            <li>Cookies and similar technologies</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and manage your account</li>
            <li>Connect job seekers with employers</li>
            <li>Personalize your experience</li>
            <li>Communicate with you about our services</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Protect against, identify, and prevent fraud and other illegal activity</li>
            <li>Comply with our legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 my-4">
            <li>
              <strong>Other Users:</strong> When you submit a job application or post a job, your profile information
              will be shared with the relevant employers or job seekers.
            </li>
            <li>
              <strong>Service Providers:</strong> We may share your information with third-party vendors, consultants,
              and other service providers who need access to such information to carry out work on our behalf.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
              response to valid requests by public authorities.
            </li>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a
              portion of our assets, your information may be transferred as part of that transaction.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
          <p>
            We will retain your information for as long as your account is active or as needed to provide you services.
            We will retain and use your information as necessary to comply with our legal obligations, resolve disputes,
            and enforce our agreements.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights and Choices</h2>
          <p>You have several rights regarding your personal information:</p>
          <ul className="list-disc pl-6 my-4">
            <li>
              <strong>Account Information:</strong> You can update, correct, or delete your account information at any
              time by logging into your account settings.
            </li>
            <li>
              <strong>Marketing Communications:</strong> You can opt out of receiving promotional emails by following
              the instructions in those emails.
            </li>
            <li>
              <strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can usually choose
              to set your browser to remove or reject cookies.
            </li>
            <li>
              <strong>Data Access and Portability:</strong> You can request a copy of your personal data that we hold.
            </li>
            <li>
              <strong>Data Deletion:</strong> You can request that we delete your personal information.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal
            information. However, please be aware that no method of transmission over the Internet or method of
            electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. International Data Transfers</h2>
          <p>
            Your information may be transferred to, and maintained on, computers located outside of your state,
            province, country, or other governmental jurisdiction where the data protection laws may differ from those
            in your jurisdiction.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
          <p>
            Our Service is not directed to children under the age of 18. We do not knowingly collect personal
            information from children under 18. If you are a parent or guardian and you are aware that your child has
            provided us with personal information, please contact us.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p className="mt-2">
            <strong>Email:</strong> privacy@ceylonworkforce.com
            <br />
            <strong>Address:</strong> 123 Temple Road, Colombo, Sri Lanka
          </p>
        </div>

        <div className="border-t pt-8 mt-12">
          <p className="text-sm text-gray-600">
            By using Ceylon Workforce, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/terms-of-service" className="text-primary hover:underline">
              Terms of Service
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
