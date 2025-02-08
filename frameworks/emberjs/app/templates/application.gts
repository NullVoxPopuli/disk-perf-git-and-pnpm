import Route from 'ember-route-template';
import { pageTitle } from 'ember-page-title';
import { WelcomePage } from 'ember-welcome-page';

export default Route(
  <template>
    {{pageTitle "Emberjs"}}
    
    {{outlet}}

    {{! The following component displays Ember's default welcome message. }}
    <WelcomePage />
    {{! Feel free to remove this! }}
  </template>
);
