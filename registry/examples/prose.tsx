import { Prose } from "@/components/site/prose";

export function Site() {
  return (
    <div className="px-5 py-16 sm:px-0">
      <Prose eyebrow="Compliance" title="Terms of Use" meta="Last updated July 10, 2026">
        <p>
          Welcome to the service (the “Service”). These terms govern your use of the website, the cards and the tools for agents. By using the Service you agree to them and to our{" "}
          <a href="https://legal.raincards.xyz/legal/privacy-policy">Privacy Policy</a>.
        </p>
        <h2>Eligibility</h2>
        <p>
          You must be at least 18 years old and able to form a binding contract. Cards are issued under the <a href="https://agentcard.sh/card-terms">Cardholder Agreement</a>.
        </p>
        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the services for any unlawful purpose.</li>
          <li>Attempt unauthorized access to any account or system.</li>
          <li>Interfere with or disrupt the services.</li>
        </ul>
        <h3>Additional definitions</h3>
        <ol>
          <li>The issuing bank is an express third-party beneficiary of these terms.</li>
          <li>
            An API key such as <code>sk_live_…</code> is yours to keep secret.
          </li>
        </ol>
        <h2>Fees</h2>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>Fees</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Annual fees</th>
              <td>None</td>
            </tr>
            <tr>
              <th>International transaction</th>
              <td>1% of each transaction in U.S. dollars</td>
            </tr>
            <tr>
              <th>Late payment</th>
              <td>
                <strong>None.</strong> Learn more at <a href="https://www.consumerfinance.gov">consumerfinance.gov</a>.
              </td>
            </tr>
          </tbody>
        </table>
        <pre>
          <code>{`npx agent-cards setup`}</code>
        </pre>
      </Prose>
    </div>
  );
}
