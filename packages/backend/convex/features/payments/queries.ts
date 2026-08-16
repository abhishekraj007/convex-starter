import { query } from "../../_generated/server";
import { getWebPaymentProvider } from "../../lib/paymentProvider";
import { webPaymentProviderValidator } from "../../lib/subscriptionValidators";

export const getProvider = query({
  args: {},
  returns: webPaymentProviderValidator,
  handler: async () => {
    return getWebPaymentProvider();
  },
});
