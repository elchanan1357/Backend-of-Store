import { logger } from 'shared';
import twilio from 'twilio';


const client = twilio(process.env['TWILIO_ACCOUNT_ID'], process.env['TWILIO_AUTH_TOKEN']);

export const callToUser = async (recipientNumber: string, totalAmount: number, username?: string,) => {

  const userNumber = formatIsraeliPhone(recipientNumber);
  if(!userNumber) {
    logger.debug(`Unable to send a request for voice call since this number: ${recipientNumber} is not supported`);
    return;
  }
  const message = customMessage(totalAmount, username)
  try {
    await client.calls
      .create({
        twiml: message,
        from: process.env['TWILIO_PHONE_NUMBER']!,
        to: userNumber
      })

    logger.info(`Call initiated successfully. ${{recipientNumber, message}}`)
  } catch (error) {
    logger.error(`Error initiating call ${{recipientNumber, message}}`, error);
  }
}

const formatIsraeliPhone = (phone: string): string | null => {
  // rm non-numbers chars
  let cleanedPhone = phone.replace(/[^\d+]/g, '');

  // add +
  if (cleanedPhone.startsWith('972')) {
    cleanedPhone = `+${cleanedPhone}`;
  }

  if (cleanedPhone.startsWith('0')) {
    cleanedPhone = `+972${cleanedPhone.slice(1)}`;
  }

  if (!cleanedPhone.startsWith('+972')) {
    return null;
  }

  // Verify number length
  const digitsAfterPrefix = cleanedPhone.replace('+972', '').replace(/\D/g, '');
  if (digitsAfterPrefix.length !== 9) {
    return null;
  }

  return cleanedPhone;
};

const customMessage = (totalAmount: number, userName?: string,): string => {
  // const t = totalAmount.replace(/[^\d]/g, '');
  
  let extraMessage = "";
  
  if (userName?.toLowerCase().includes('haim')) {
    extraMessage = `
      <break time="700ms"/>
      Oh <break time="300ms"/> and Haim... <break time="500ms"/>
      <prosody rate="85%">Give us a hundred!</prosody>
    `;
  }

  return `
    <Response>
      <Say voice="alice">
        <speak>
          <prosody rate="92%">Hello <break time="200ms"/> <emphasis level="moderate">${userName || 'Customer'}</emphasis>,</prosody> 
          <break time="300ms"/>
          your order totaling <say-as interpret-as="cardinal">${totalAmount}</say-as> Shekels <break time="400ms"/>
          has been successfully placed.
          <break time="500ms"/>
          <prosody pitch="+5%">Thank you for shopping with us!</prosody>
          ${extraMessage}
          <break time="300ms"/>
        </speak>
      </Say>
    </Response>
  `;
};



const ILcustomMessage = (totalAmount: number, userName?: string): string => {
  let extraMessage = "";
  
  if (userName?.toLowerCase().includes('haim')) {
    extraMessage = `
      <break time="700ms"/>
      אה <break time="300ms"/> אה וחיים... <break time="500ms"/>
      <prosody rate="85%">תן לנו מאה!</prosody>
    `;
  }

  return `
    <Response>
      <Say voice="Polly.Tomer" language="he-IL">
        <speak>
          <prosody rate="92%">שלום <break time="200ms"/> <emphasis level="moderate">${userName || 'אח'}</emphasis>,</prosody> 
          <break time="300ms"/>
          ההזמנה שלך על סך <say-as interpret-as="cardinal">${totalAmount}</say-as> שקלים <break time="400ms"/>
          נקלטה בהצלחה.
          <break time="500ms"/>
          <prosody pitch="+5%">תודה שקנית אצלנו!</prosody>
          ${extraMessage}
          <break time="300ms"/>
        </speak>
      </Say>
    </Response>
  `;
};
// callToUser('+972521111111', 'Hello, this is a test call');