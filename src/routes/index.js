import StepLayout from '../layouts/StepLayout.js';
import * as steps from '../steps/index.js';

export default store => ({
  path : '/',
  component : StepLayout,
  indexRoute : { component: steps.WelcomeStep },
  childRoutes : [
    { path: 'lob-setup', component: steps.LobStep },
    { path: 'size', component: steps.SizeStep },
    { path: 'image', component: steps.ImageStep },
    { path: 'message', component: steps.MessageStep },
    { path: 'from', component: steps.FromAddressStep },
    { path: 'to', component: steps.ToAddressStep },
    { path: 'preview', component: steps.PreviewStep },
    { path: 'send', component: steps.SendStep }
  ]
});
