import {
  formatModelAge,
  type PersonFields,
  personName,
  registeredAge,
} from "../lib/formatPerson";

export function PersonCell({ event }: { event: PersonFields }) {
  const name = personName(event);
  if (!name) {
    return <span className="text-muted-foreground">Неизвестный</span>;
  }
  return <span className="font-medium">{name}</span>;
}

// both ages: the model's estimate and, for a recognized person, the registered one
export function AgeCell({ event }: { event: PersonFields }) {
  const registered = registeredAge(event);
  return (
    <div className="leading-tight">
      <div>
        {formatModelAge(event.age)}{" "}
        <span className="text-xs text-muted-foreground">оценка</span>
      </div>
      {registered && (
        <div>
          {registered}{" "}
          <span className="text-xs text-muted-foreground">по базе</span>
        </div>
      )}
    </div>
  );
}
