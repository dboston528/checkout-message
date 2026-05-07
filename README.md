# checkout-message

An embeddable JavaScript SDK that renders a "pay in installments" widget on any merchant page — no framework required.

## Usage

Add two things to your page:

```html
<!-- 1. Target div wherever you want the widget -->
<div id="payment-widget"></div>

<!-- 2. Script tag, before </body> -->
<script src="https://yourcdn.com/sdk.js" async></script>
```

That's it. The SDK finds the div, fetches pricing config, and renders the widget automatically.

## Configuration

Pass options via `data-*` attributes on the script tag:

| Attribute | Description | Example |
|---|---|---|
| `data-amount` | Product price (SDK calculates monthly) | `data-amount="200"` |
| `data-provider` | Payment provider name | `data-provider="FlexPay"` |
| `data-installments` | Number of installments | `data-installments="4"` |
| `data-api-url` | Custom config endpoint | `data-api-url="/api/pay-config"` |

```html
<script
  src="sdk.js"
  data-amount="200"
  data-provider="FlexPay"
  data-installments="4"
  async
></script>
```

## Behavior

- Shows a **skeleton loader** while config is fetching
- Renders the **widget** with live data on success
- Falls back to a **neutral message** if the API is unreachable — page never breaks
- Logs render timing to the console via the Performance API

## API Response Shape

The SDK expects a JSON endpoint returning:

```json
{
  "price": 200,
  "monthly": 50,
  "installments": 4,
  "provider": "FlexPay"
}
```

## Local Development

```bash
npx serve .
```

Open `http://localhost:<port>` to see the merchant test page.
