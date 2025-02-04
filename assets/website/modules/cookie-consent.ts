import 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/src/cookieconsent.css';
import { translate, translatePlural } from '../utils/translate';

const cookieConsent = initCookieConsent();

cookieConsent.run({
    current_lang: 'de',
    revision: 0, // Has to be raised when something changes
    autorun: true,
    autoclear_cookies: true,
    cookie_expiration: 180, // days
    languages: {
        de: {
            consent_modal: {
                title: translate('cmp-title'),
                description: translate('cmp-intro'),
                primary_btn: {
                    text: translate('cmp-accept-all'),
                    role: 'accept_all'              // 'accept_selected' or 'accept_all'
                },
                secondary_btn: {
                    text: translate('cmp-settings'),
                    role: 'settings'                // 'settings' or 'accept_necessary'
                }
            },
            settings_modal: {
                title: translate('cmp-cookie-settings'),
                save_settings_btn: translate('cmp-save-settings'),
                accept_all_btn: translate('cmp-accept-all'),
                reject_all_btn: translate('cmp-reject-all'),       // optional, [v.2.5.0 +]
                cookie_table_headers: [
                    { col1: translate('cmp-title-name') },
                    { col2: translate('cmp-title-domain') },
                    { col3: translate('cmp-title-expiry') },
                    { col4: translate('cmp-title-description') },
                    { col5: translate('cmp-title-type') }
                ],
                blocks: [
                    {
                        title: translate('cmp-title-cookie-usage'),
                        description: translate('cmp-intro-short')
                    },
                    {
                        title: translate('cmp-essential-cookies'),
                        description: translate('cmp-essential-cookies-description'),
                        toggle: {
                            value: 'necessary',
                            enabled: true,
                            readonly: true
                        },
                        cookie_table: [
                            {
                                col1: 'PHPSESSID',
                                col2: location.host,
                                col3: translatePlural('months', 6),
                                col4: translate('cmp-phpsessid-cookie-description'),
                                col5: translate('cmp-permanent-cookie')
                            },
                            {
                                col1: 'cc_cookie',
                                col2: location.host,
                                col3: translatePlural('months', 6),
                                col4: translate('cmp-cc-cookie-description'),
                                col5: translate('cmp-permanent-cookie')
                            }
                        ]
                    },
                    {
                        title: translate('cmp-analysis-cookies-title'),
                        description: translate('cmp-analysis-cookies-description'),
                        toggle: {
                            value: 'analytics',
                            enabled: false,
                            readonly: false
                        },
                        cookie_table: [
                            {
                                col1: '^_ga',
                                col2: 'google.com',
                                col3: translatePlural('years', 2),
                                col4: 'description ...',
                                col5: translate('cmp-permanent-cookie'),
                                is_regex: true
                            },
                            {
                                col1: '_gid',
                                col2: 'google.com',
                                col3: translatePlural('days', 1),
                                col4: 'description ...',
                                col5: translate('cmp-permanent-cookie')
                            }
                        ]
                    }
                ]
            }
        }
    },
    gui_options: {
        consent_modal: {
            layout: 'cloud',               // box/cloud/bar
            position: 'bottom center',     // bottom/middle/top + left/right/center
            transition: 'slide',           // zoom/slide
            swap_buttons: false            // enable to invert buttons
        },
        settings_modal: {
            layout: 'box',                 // box/bar
            // position: 'left',           // left/right
            transition: 'slide'            // zoom/slide
        }
    }
});
