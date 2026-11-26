# Browser tests (Playwright)

Real Chrome against a deployed site: every page as every role, every harmless button, the forms
from adding to deleting, the journal, search and the assistant, the English interface.

```bash
# on the server (tests http://localhost); logins come from ~/.config/skud-e2e/credentials.env
./run.sh                       # everything
./run.sh tests/02-forms.spec.ts -g point
E2E_BASE_URL=https://skud.example.kz ./run.sh
```

`credentials.env` holds `E2E_<ROLE>_USER` / `E2E_<ROLE>_PASSWORD` for `SUPER_ADMIN`, `ADMIN`,
`OPERATOR`, `REGISTRAR`. Only the super admin must exist; `01-accounts` creates the others through
the admin form (in the organization "E2E организация"). Keep the file out of git (`chmod 600`).

`fixtures/face.jpg` (not in git): a photo with one clear face, for enrolling a person. Without it
that test is skipped.

| File | What it checks |
|---|---|
| `00-public` | login page, wrong password, every page needs a login, hidden health endpoints |
| `01-accounts` | test organization + one login per role, created through the forms |
| `02-forms` | add / change / remove organization, camera (start/stop), point, person, login; empty forms; an admin with their organization's cameras |
| `03-monitoring` | journal filters and events, history, live stream, search, assistant answer |
| `04-crawl` | per role: the menu, every page, every non-destructive button, forbidden pages |
| `05-language` | no Russian left in the English interface |
| `99-cleanup` | removes anything named "E2E …" a failed run left behind, and the test logins' chats |

Records created by tests carry the run id and are removed again. The crawler never presses
delete / start / stop / approve buttons on real data.
