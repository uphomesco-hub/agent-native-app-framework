import { AgentActionPlanner, AgentAppRegistry, type AgentAppManifest } from "../src/index.js";

export const commerceManifest: AgentAppManifest = {
  id: "demo-commerce",
  name: "Demo Commerce",
  version: "0.1.0",
  description: "A small React-style commerce app descriptor.",
  screens: [
    {
      id: "home",
      title: "Home",
      purpose: "Let the user browse products and move into search or cart flows.",
      route: "/",
      elements: [
        {
          id: "search-input",
          kind: "input",
          label: "Search products",
          purpose: "Collect the user's product search query.",
          writesState: ["query"],
          actions: [
            {
              id: "search-products",
              title: "Search products",
              description: "Run a product search and open the results screen.",
              inputSchema: { query: "string" },
              navigatesTo: "results",
              risk: "low"
            }
          ]
        },
        {
          id: "cart-link",
          kind: "link",
          label: "Cart",
          purpose: "Open the shopping cart.",
          actions: [
            {
              id: "open-cart",
              title: "Open cart",
              description: "Navigate to the cart screen.",
              navigatesTo: "cart",
              risk: "low"
            }
          ]
        }
      ],
      state: [
        {
          key: "query",
          description: "Current product search query.",
          valueType: "string"
        }
      ]
    },
    {
      id: "results",
      title: "Results",
      purpose: "Show matching products and let the user add one to cart.",
      route: "/search",
      elements: [
        {
          id: "product-card",
          kind: "card",
          purpose: "Represent a product that can be inspected or added to cart.",
          readsState: ["selectedProductId"],
          actions: [
            {
              id: "add-to-cart",
              title: "Add product to cart",
              description: "Add the selected product to cart.",
              inputSchema: { productId: "string", quantity: "number" },
              navigatesTo: "cart",
              risk: "medium"
            }
          ]
        }
      ],
      state: [
        {
          key: "selectedProductId",
          description: "The product currently selected by the user or agent.",
          valueType: "string"
        }
      ]
    },
    {
      id: "cart",
      title: "Cart",
      purpose: "Review cart contents before checkout.",
      route: "/cart",
      elements: [
        {
          id: "checkout-button",
          kind: "button",
          label: "Checkout",
          purpose: "Start checkout after the user confirms purchase intent.",
          constraints: [
            {
              type: "confirmation",
              description: "The user must explicitly confirm before payment begins."
            }
          ],
          actions: [
            {
              id: "start-checkout",
              title: "Start checkout",
              description: "Open the checkout flow.",
              navigatesTo: "checkout",
              risk: "high",
              requiresConfirmation: true
            }
          ]
        }
      ]
    }
  ],
  capabilities: [
    {
      id: "product-purchase",
      description: "Search for a product, add it to cart, and prepare checkout with user confirmation.",
      actions: ["search-products", "add-to-cart", "start-checkout"]
    }
  ]
};

const registry = new AgentAppRegistry();
registry.register(commerceManifest);

const planner = new AgentActionPlanner(registry);
const plan = planner.planByActionIds("demo-commerce", ["search-products", "add-to-cart", "start-checkout"]);

console.log(JSON.stringify({ plan, needsApproval: planner.requiresHumanApproval(plan) }, null, 2));
