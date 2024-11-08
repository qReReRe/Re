export default function Terms() {
  const isDarkTheme = true;
  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        isDarkTheme
          ? "bg-dark-background text-light-text1"
          : "bg-light-background text-dark-text1"
      }`}
    >
      <div className="flex-grow p-5 overflow-auto">
        <h1 className="4xl">Re</h1>
        <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Re (the &quot;Website&quot;), you agree to
            comply with and be bound by these Terms of Use (the
            &quot;Terms&quot;). If you do not agree to these Terms, please
            refrain from using the Website.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">
            2. Intellectual Property Rights
          </h2>
          <p>
            All content on this Website, including but not limited to text,
            graphics, logos, designs, and user interfaces (the
            &quot;Content&quot;), are the intellectual property of Re and are
            protected by copyright, trademark, and other intellectual property
            laws. Unauthorized use, copying, or distribution of any Content is
            strictly prohibited.
          </p>
          <p>
            You are granted a limited, non-exclusive, revocable license to
            access and use the Website for personal, non-commercial purposes
            only. This license does not grant you any rights to modify,
            reproduce, distribute, or create derivative works from any Content
            without express written permission from Re.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">3. Prohibited Use</h2>
          <p>
            You agree not to use the Website for any unlawful or unauthorized
            purpose, including but not limited to:
          </p>
          <ul className="list-disc pl-5">
            <li>
              Copying or reproducing any part of the Website or its Content
              without permission;
            </li>
            <li>
              Using the Website to infringe on the intellectual property rights
              of others;
            </li>
            <li>
              Attempting to reverse-engineer, decompile, or otherwise misuse the
              code, design, or underlying concepts of the Website.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">4. Copyright Infringement</h2>
          <p>
            If you believe that your copyright or other intellectual property
            rights have been infringed, please contact us through the contact
            form available on the Website. We will investigate the matter and
            take appropriate action, which may include removing the infringing
            content.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">
            5. Disclaimer of Warranties
          </h2>
          <p>
            The Website and its Content are provided on an &quot;as is&quot; and
            &quot;as available&quot; basis. Re makes no warranties, express or
            implied, regarding the operation or availability of the Website or
            the accuracy, reliability, or completeness of the Content. We
            disclaim all warranties, including implied warranties of
            merchantability and fitness for a particular purpose.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Re shall not be liable for
            any damages, losses, or liabilities arising from your use of the
            Website, including but not limited to direct, indirect, incidental,
            or consequential damages.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">7. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Any changes
            will be posted on this page, and continued use of the Website after
            such changes will constitute your acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">8. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the
            laws of NY, United States of America. Any disputes arising under
            these Terms will be subject to the exclusive jurisdiction of the
            courts of NY, United States of America.
          </p>
        </section>
      </div>
    </div>
  );
}
