
import { useState } from "react";

import Card from "../ui/Card";
import Button from "../ui/Button";
import { riskStyles } from "../ui/verdictStyles";

import { checkScamRules } from "../../logic/scamRules";
import { explainScam } from "../../api/ai";

function ScamCheck({ onBack, language = "en" }) {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);
    setExplanation("");

    if (!message.trim()) {
      setError("Please enter a loan message.");
      return;
    }

    if (message.length > 3000) {
      setError("Maximum 3000 characters allowed.");
      return;
    }

    setLoading(true);

    try {
      const ruleResult = checkScamRules(message);

      if (
        !ruleResult ||
        ruleResult.error ||
        !ruleResult.riskLevel
      ) {
        throw new Error(
          ruleResult?.message || "Unable to check this message."
        );
      }

      setResult(ruleResult);
      setLoading(false);

      // AI explanation is optional.
      setAiLoading(true);

      try {
        const aiResult = await explainScam(
          message,
          ruleResult,
          language
        );

        if (
          aiResult &&
          !aiResult.error &&
          typeof aiResult.explanation === "string"
        ) {
          setExplanation(aiResult.explanation);
        }
      } catch (aiError) {
        console.error("AI explanation failed:", aiError);
      } finally {
        setAiLoading(false);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const risk = result
    ? riskStyles[result.riskLevel]
    : null;

  return (
    <div className="min-h-screen bg-page px-4 py-8 sm:px-6">
      <div className="max-w-3xl mx-auto">

        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-brand font-medium"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-brand">
          Loan Scam Checker
        </h1>

        <p className="text-muted mt-2">
          Check suspicious loan messages for possible warning signs.
        </p>

        <Card className="mt-8">

          <form onSubmit={handleCheck}>

            <label className="block font-semibold text-ink mb-3">
              Paste your loan message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={3000}
              rows={7}
              placeholder="Paste the loan offer message here..."
              className="w-full rounded-lg border border-line p-4 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-brand/20"
            />

            <div className="text-right text-sm text-muted mt-2">
              {message.length}/3000 characters
            </div>

            {error && (
              <p className="text-bad-text text-sm mt-3" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5">
              <Button
                type="submit"
                block
                disabled={loading || aiLoading}
              >
                {loading ? "Checking..." : "Check Loan Message"}
              </Button>
            </div>

          </form>
        </Card>

        {result && risk && (
          <div className="mt-8 space-y-5">

            <Card>
              <h2 className="text-xl font-bold text-ink mb-4">
                Scam Check Result
              </h2>

              <div className={`border rounded-xl p-5 ${risk.box}`}>
                <div className="text-3xl font-bold">
                  {risk.icon} {result.riskLevel} Risk
                </div>
              </div>

              <h3 className="font-bold mt-6 mb-3">
                Red Flags
              </h3>

              {result.redFlags?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-ink">
                  {result.redFlags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">
                  No red flags were identified by the rules.
                </p>
              )}

              <h3 className="font-bold mt-6 mb-3">
                Recommended Next Steps
              </h3>

              {result.nextSteps?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-ink">
                  {result.nextSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">
                  Verify the offer through your bank's official channels.
                </p>
              )}
            </Card>

            {aiLoading && (
              <Card>
                <p className="text-muted">
                  Generating explanation...
                </p>
              </Card>
            )}

            {explanation && (
              <Card>
                <h3 className="font-bold text-lg text-brand mb-3">
                  AI Explanation
                </h3>
                <p className="text-ink whitespace-pre-line">
                  {explanation}
                </p>
              </Card>
            )}

            <p className="text-sm text-muted text-center">
              This is a guide, not proof. Always verify with your bank.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default ScamCheck;
