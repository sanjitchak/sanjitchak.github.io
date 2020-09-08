Paytabs express checkout sample
========
![Paytabs-express-checkout-v4.0.0](https://img.shields.io/badge/Paytabs%20express%20checkout-v4.0.0-green.svg)

For more information please see [the website][1].


Install
--------

Read the documentation to know how to integrate your application with the library
[documentation v4.0][1]

```html
<script src="https://paytabs.com/express/v4/paytabs-express-checkout.js"
   id="paytabs-express-checkout"
   data-secret-key="merchant_secret_key"
   data-merchant-id="merchant_id"
   data-url-redirect="http://example.com/callback/"
   data-amount="10.0"
   data-currency="SAR"
   data-title="John Doe"
   data-product-names="Iphone"
   data-order-id="25"
   data-customer-phone-number="5486253"
   data-customer-email-address="john.deo@paytabs.com"
   data-customer-country-code="973"
>
</script>
```

[![Edit static](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/my09713z28?fontsize=14)
## Overview

PayTabs Express Checkout is a solution that provides an efficient checkout process for online
shoppers which keeps them on the merchant’s website while making a payment and even after the
payment is complete.

![image](/screenshot.png)

## Request 

> You have to [Login](https://www.paytabs.com/login) to get your `data-secret-key` and `data-merchant-id`

**Required**

| Element                                                     | Description                                                                                                                                                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-secret-key`<br/> <label>`String`</label>              | Merchant Secret Key which is found in `Merchant Dashboard > Navigation Menu > Secret Key`                                                                                          |
| `data-merchant-id`<br/> <label>`String`</label>             | Merchant ID found at the top-right corner of the Merchant Dashboard. <br/> Example: 10012345                                                                                       |
| `data-amount`<br/> <label>`Decimal`</label>                 | Final amount requested for payment should include the total amount of the products, discount, shipping charges, VAT and any other charges.                                         |
| `data-currency`<br/> <label>`String`</label>                | Currency of the amount stated: 3 character ISO currency code <br/> Examples: `USD` for US dollars <br/>`AED` for Emirati Dirham <br/>`SAR` for Saudi Riyal                         |
| `data-title` <br/><label>`String`</label>                   | Title of the transaction,<br/> Example: Billing for Order 1234, or Bill To Mr. John Doe, etc                                                                                       |
| `data-product-names`<br/> <label>`String`</label>           | For multiple products use comma separated products (i.e: iPhone X, iPhone, Lightning Dock, iPhone earphones)                                                                       |
| `data-order-id` <br/> <label>`String`</label>               | Order ID generated on merchant's Website.                                                                                                                                          |
| `data-customer-phone-number`  <br/> <label>`String`</label> | Phone number of the customer: minimum length 5, maximum length 15                                                                                                                  |
| `data-customer-email-address`<br/> <label>`String`</label>  | Email of the customer                                                                                                                                                              |
| `data-customer-country-code` <br/> <label>`String`</label>  | International dialing code for phone number of the customer. Please enter country code without ‘0’ or ‘+’ <br/> Example: UAE country code is `971`<br/>USA country code is `1` |
| `data-url-redirect`<br/> <label>`String`</label>            | Call back URL after payment is successful. <br/>Example: https://www.example.com/payment_result                                                                                    |


**Billing address (optional)**

| Element                                                   | Description                                                                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-billing-full-address` <br/> <label>`String`</label> | Full billing Address <br>Multiple address lines will be merged into one single line. <br/>maximum string length 60                                                                                                                                                                                                                      |
| `data-billing-city` <br/><label>`String`</label>          | Billing city <br/> maximum string length 50                                                                                                                                                                                                                                                                                             |
| `data-billing-state` <br/><label>`String`</label>         | Billing state <br/> For USA and Canada please use the correct state and province 2-character codes. <br/>https://www.ups.com/worldshiphelp/WS16/ENU/AppHelp/Codes/State_Province_Codes.htm <br/>**Note**: Correct State field is a mandatory field in case billing country is US or Canada                                              |
| `data-billing-country`<br/> <label>`String`</label>       | Billing country: 3-Character ISO country code. <br/> Examples: `ARE` for United Arab Emirates<br/>`SAU` for Kingdom of Saudi Arabia<br/>`USA` for United States of America                                                                                                                                                              |
| `data-billing-postal-code` <br/><label>`String`</label>   | Billing postal code <br/> When the billing country is the U.S., the 9-digit postal code must follow this format: `[5 digits][dash][4 digits]`Example `12345-6789` <br/>When the billing country is Canada, the 6-digit postal code must follow this format: `[alpha][numeric][alpha][space][numeric][alpha][numeric]` Example `A1B 2C3` |

**Shipping address (optional)**

| Element                                                   | Description                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-shipping-full-address` <br/><label>`String`</label> | Full shipping address. Multiple address lines will be merged into one single line. <br/>maximum string length 60                                                                                                                                                                                                                         |
| `data-shipping-city` <br/><label>`String`</label>         | Shipping city <br/> maximum string length 50                                                                                                                                                                                                                                                                                             |
| `data-shipping-state`  <br/><label>`String`</label>       | Shipping State <br/>For USA and Canada please use the correct state and province 2-character codes. <br/>https://www.ups.com/worldshiphelp/WS16/ENU/AppHelp/Codes/State_Province_Codes.htm <br/>**Note**: Correct State field is a mandatory field in case billing country is US or Canada                                               |
| `data-shipping-country` <br/><label>`String`</label>      | Shipping country  <br/> 3-Character ISO country code. <br/> Examples: `ARE` for United Arab Emirates<br/>`SAU` for Kingdom of Saudi Arabia<br/>`USA` for United States of America                                                                                                                                                        |
| `data-shipping-postal-code` <br/><label>`String`</label>  | Shipping Postal code <br/> When the billing country is the U.S., the 9-digit postal code must follow this format: `[5 digits][dash][4 digits]`Example `12345-6789`<br/> When the billing country is Canada, the 6-digit postal code must follow this format: `[alpha][numeric][alpha][space][numeric][alpha][numeric]` Example `A1B 2C3` |

**Additional redirecting settings (optional)**

| Element                                                | Description                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-url-cancel`<br/> <label>`String`</label>         | Call back URL after payment is cancelled. <br/> Example: https://www.example.com/payment_cancel <br/><br/> In case the user closes the popup during the transactions and `data-url-cancel` parameter is not passed in the merchant's Express Checkout button script, a query param <u>is_canceled_pt=1</u> is passed in the return link `data-url-redirect` |
| `data-redirect-on-reject`<br/><label>`Boolean`</label> | If you wish the cardholder to be redirected to `data-url-redirect` even if the payment is rejected the pass this value as `true`, if you wish the merchant to remain on the same page pass this value as `false`                                                                                                                                            |
| `data-is-self`<br/><label>`Boolean`</label>            | If you wish to override the mandatory redirection after successful payment you can pass this value as “true” and user will not be redirected after the payment whether its successful or rejected and will stay on the same page                                                                                                                          |


**iFrame settings (optional)**

| Element                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-ui-type` <br/> <label>`String`</label>         | User interface implementation, the option allows you to customize express checkout and choose between three different option<br/> `Button` Default, Express Checkout Button is displayed and when clicked will load Express Checkout popup <br/>`Iframe` Loads Express Checkout as an embedded iframe <br/>`Click` You can use this with your custom checkout button and use `Paytabs.openPaymentPage()` with JS or after ajax requests |
| `data-ui-element-id`<br/> <label>`String`</label>    | Dom element id to show payment page                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data-is-popup`<br/> <label>`Boolean`</label>        | Show payment page as popup full screen if you pass as `true`                                                                                                                                                                                                                                                                                                                                                                            |
| `data-color` <br/> <label>`String`</label>           | Payment page theme color <br/> Default color `#0075c9`                                                                                                                                                                                                                                                                                                                                                                                  |
| `data-ui-show-header` <br/> <label>`Boolean`</label> | To enable or disable the header which includes the logo and close button. <br/> Default value is `true`. This feature will only work if `data-is-pop` is `false`                                                                                                                                                                                                                                                                        |
| `data-ui-show-billing-address`<br/> <label>`Boolean`</label>        | Shows or hides the billing address, default value is `true`                                                                                                                                                                                                                                                                                                                                                                            |
| `data-language`<br/> <label>`String`</label>         | Language `"en"` , `"ar"` <br/> Default `"en"`                                                                                                                                                                                                                                                                                                                                                                                           |

**Payment button customization (optional)**

| Element                                                     | Description           |
| ----------------------------------------------------------- | --------------------- |
| `data-checkout-button-width` <br/> <label>`String`</label>  | Pay Now button width  |
| `data-checkout-button-height` <br/> <label>`String`</label> | Pay Now button height |
| `data-checkout-button-img-url` <br/> <label>`Link`</label>  | Pay Now image source  |


Paytabs
--------
[Support][2] | [Terms of Use][3] | [Privacy Policy][4]




 [1]: https://dev.paytabs.com/docs/express-checkout-v4/
 [2]: https://www.paytabs.com/en/support/
 [3]: https://www.paytabs.com/en/terms-of-use/
 [4]: https://www.paytabs.com/en/privacy-policy/
