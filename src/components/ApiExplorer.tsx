import { useMemo, useState, useEffect } from "react";

type Method = "GET" | "POST";

type Endpoint = {
  id: string;
  method: Method;
  path: string;
  name: string;
  description: string;
  response: unknown;
};

const endpoints: Endpoint[] = [
  {
    id: "projects",
    method: "GET",
    path: "/v1/projects",
    name: "List projects",
    description: "Retrieve projects associated with your account.",
    response: {
      data: [
        {
          id: "proj_123",
          name: "My Project",
          status: "active",
        },
        {
          id: "proj_456",
          name: "Analytics",
          status: "active",
        },
      ],
    },
  },
  {
    id: "users",
    method: "GET",
    path: "/v1/users",
    name: "List users",
    description: "Retrieve users associated with your account.",
    response: {
      data: [
        {
          id: "usr_123",
          name: "Jane Doe",
          email: "jane@example.com",
        },
        {
          id: "usr_456",
          name: "John Smith",
          email: "john@example.com",
        },
      ],
    },
  },
  {
    id: "webhooks",
    method: "POST",
    path: "/v1/webhooks",
    name: "Create webhook",
    description: "Create a webhook subscription for your application.",
    response: {
      id: "wh_123",
      url: "https://example.com/webhooks",
      status: "active",
    },
  },
];

export default function ApiExplorer() {
  const [selectedId, setSelectedId] = useState("projects");
  const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhooks");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const endpoint = params.get("endpoint");

    if (endpoint && endpoints.some((item) => item.id === endpoint)) {
      setSelectedId(endpoint);
    }
  }, []);

  const [requestState, setRequestState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const selectedEndpoint = useMemo(
    () => endpoints.find((endpoint) => endpoint.id === selectedId)!,
    [selectedId],
  );

  const requestBody =
    selectedEndpoint.method === "POST"
      ? {
          url: webhookUrl,
          events: ["project.created", "project.updated"],
        }
      : null;

  const request = {
    method: selectedEndpoint.method,
    url: `https://api.devhub.example.com${selectedEndpoint.path}`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    ...(requestBody ? { body: requestBody } : {}),
  };

  function handleSend() {
    setRequestState("loading");

    window.setTimeout(() => {
      if (!apiKey || apiKey === "YOUR_API_KEY") {
        setRequestState("error");
        return;
      }

      setRequestState("success");
    }, 700);
  }
  const codeExamples = {
    curl: [
      `curl ${request.url} \\`,
      `  -H "Authorization: Bearer ${apiKey}" \\`,
      ...(requestBody
        ? [
            `  -H "Content-Type: application/json" \\`,
            `  -d '${JSON.stringify(requestBody)}'`,
          ]
        : []),
    ].join("\n"),

    javascript: [
      `const response = await fetch("${request.url}", {`,
      `  method: "${request.method}",`,
      `  headers: {`,
      `    Authorization: "Bearer ${apiKey}",`,
      ...(requestBody
        ? [
            `    "Content-Type": "application/json",`,
            `  },`,
            `  body: ${JSON.stringify(requestBody)},`,
          ]
        : [`  },`]),
      `});`,
      ``,
      `const data = await response.json();`,
    ].join("\n"),

    python: [
      `import requests`,
      ``,
      `response = requests.${request.method.toLowerCase()}(`,
      `    "${request.url}",`,
      `    headers={"Authorization": "Bearer ${apiKey}"},`,
      ...(requestBody ? [`    json=${JSON.stringify(requestBody)},`] : []),
      `)`,
      ``,
      `data = response.json()`,
    ].join("\n"),
  };
  return (
    <section className="api-explorer">
      <div className="explorer-header">
        <div>
          <p className="section-eyebrow">TRY IT</p>
          <h2>API Explorer</h2>
          <p>Build a request, send it, and inspect the example response.</p>
        </div>
      </div>

      <div className="explorer-layout">
        <aside className="explorer-endpoints">
          <p className="explorer-label">Endpoints</p>

          {endpoints.map((endpoint) => (
            <button
              key={endpoint.id}
              type="button"
              className={`endpoint-option ${
                selectedId === endpoint.id ? "is-active" : ""
              }`}
              onClick={() => {
                setSelectedId(endpoint.id);
                setRequestState("idle");
              }}
            >
              <span
                className={`method-badge method-${endpoint.method.toLowerCase()}`}
              >
                {endpoint.method}
              </span>

              <span>
                <strong>{endpoint.name}</strong>
                <small>{endpoint.path}</small>
              </span>
            </button>
          ))}
        </aside>

        <div className="explorer-main">
          <div className="explorer-card">
            <div className="explorer-card-header">
              <div>
                <span
                  className={`method-badge method-${selectedEndpoint.method.toLowerCase()}`}
                >
                  {selectedEndpoint.method}
                </span>

                <code>{selectedEndpoint.path}</code>
              </div>

              <p>{selectedEndpoint.description}</p>
            </div>

            <label className="field">
              <span>API Key</span>
              <input
                type="text"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="YOUR_API_KEY"
              />
            </label>

            {selectedEndpoint.method === "POST" && (
              <label className="field">
                <span>Webhook URL</span>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(event) => setWebhookUrl(event.target.value)}
                />
              </label>
            )}

            <button
              type="button"
              className="button button-primary explorer-send"
              onClick={handleSend}
              disabled={requestState === "loading"}
            >
              Send Request
            </button>
          </div>

          <div className="explorer-output">
            <div className="output-panel">
              <div className="output-header">
                <span>Request</span>
              </div>

              <pre>{JSON.stringify(request, null, 2)}</pre>
            </div>
            <div className="output-panel code-panel">
              <div className="output-header">
                <span>Code Examples</span>
              </div>

              <div className="code-example">
                <div className="code-example-header">
                  <span>cURL</span>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(codeExamples.curl)
                    }
                  >
                    Copy
                  </button>
                </div>
                <pre>{codeExamples.curl}</pre>
              </div>

              <div className="code-example">
                <div className="code-example-header">
                  <span>JavaScript</span>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(codeExamples.javascript)
                    }
                  >
                    Copy
                  </button>
                </div>
                <pre>{codeExamples.javascript}</pre>
              </div>

              <div className="code-example">
                <div className="code-example-header">
                  <span>Python</span>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(codeExamples.python)
                    }
                  >
                    Copy
                  </button>
                </div>
                <pre>{codeExamples.python}</pre>
              </div>
            </div>
            <div className="output-panel">
              <div className="output-header">
                <span>Response</span>

                {requestState === "success" && (
                  <span className="response-status">200 OK</span>
                )}

                {requestState === "error" && (
                  <span className="response-error">401 Unauthorized</span>
                )}
              </div>

              <pre>
                {requestState === "loading"
                  ? "// Sending request..."
                  : requestState === "success"
                    ? JSON.stringify(selectedEndpoint.response, null, 2)
                    : requestState === "error"
                      ? JSON.stringify(
                          {
                            error: {
                              code: "invalid_api_key",
                              message: "The API key is missing or invalid.",
                            },
                          },
                          null,
                          2,
                        )
                      : '// Click "Send Request" to see the response'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
