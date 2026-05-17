import { isAuthTokenValid } from './authStorage';
import { navigateTo } from './navigation';

export function requireAuthForAction(destination = '/contato') {
  if (isAuthTokenValid()) {
    navigateTo(destination);
    return;
  }

  navigateTo(`/login?modo=cadastro&redirect=${encodeURIComponent(destination)}`);
}
