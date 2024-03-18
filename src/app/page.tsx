import {DateTime} from 'luxon'

function modifiedFormatDateWithOptions(unformattedDate: string, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions) {
    const formatted = new Date(unformattedDate);
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZoneName: "long"// Added the time zone to make this more explicit
    };

    return formatted
        .toLocaleDateString(
            locale === "en_UK" ? "en-UK" : locale === "en_US" ? "en-US" : locale,
            {...defaultOptions, ...options} // Also append any options we specify
        )
        .replace(",", " ");
}

export default function Home() {

    // Our API returns an ISO date
    const inputDate = '2024-04-22';

    // You should provide a valid zone IDENTIFIER, not just an offset, e.g. https://timezonedb.com/time-zones
    // This is because simple numeric offsets (GMT-5) don't account for daylight savings time differences, especially
    // when converting between two time zones & countries with their own rules. Doing this math right manually is VERY
    // hard, so it's better to just let a library handle it for you
    const inputIANATimezone: string = 'America/New_York';

    // Luxon has different format tokens
    // eg 'April 21 2024', see https://moment.github.io/luxon/#/parsing?id=table-of-tokens
    const outputFormatStringForLuxon: string = 'MMMM d yyyy z';

    const jsISODate = new Date(inputDate).toISOString()
    const jsFormattedDate = modifiedFormatDateWithOptions(inputDate, 'en-US');
    const jsFormattedDateWithTZ = modifiedFormatDateWithOptions(inputDate, 'en-US', {timeZone: inputIANATimezone});
    const luxonFormattedDateWithTZ = DateTime.fromISO(inputDate, {zone: inputIANATimezone})

    return (
        <main style={{fontSize: '20pt'}}>
            <h2>Inputs</h2>
            <ul>
                <li>Input date (string): <code>{inputDate}</code> (this is what you provide now)</li>
                <li>Input time zone identifier (string): <code>{inputIANATimezone}</code> (you need to add this to each event)</li>
                <li>Current server time & zone: <code>{modifiedFormatDateWithOptions(new Date().toDateString())}</code> (what JS is using to incorrectly convert your dates)</li>
            </ul>

            <h2>Incorrect outputs</h2>
            <ul>
                <li>Your current output is using the server or browser TZ, not the event&apos;s: <code>{jsFormattedDate}</code>
                </li>
                <ul>
                    <li>This is what JS thinks it actually means behind the scenes: <code>{jsISODate}</code></li>
                    <li>It assumes UTC (the &quot;Z&quot;) because it doesn&apos;t know the event time zone, and is incorrectly converting it</li>
                </ul>
            </ul>

            <h2>Corrected output</h2>
            <ul>
                <li>Luxon-formatted string (with explicitly specified time
                    zone): <code>{luxonFormattedDateWithTZ.toFormat(outputFormatStringForLuxon)}</code></li>
            </ul>
        </main>
    );
}
