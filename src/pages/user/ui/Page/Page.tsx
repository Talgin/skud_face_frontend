import { useNavigate } from "@tanstack/react-router";
import { CirclePlus } from "lucide-react";
import { useMemo, useState } from "react";
import { matchesPersonSearch, PersonCard, useUsersQuery } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";

export function UserPage() {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useUsersQuery();
  const [search, setSearch] = useState("");

  const visible = useMemo(
    () => users.filter((user) => matchesPersonSearch(user, search)),
    [users, search],
  );

  function handleAddButtonClick() {
    navigate({ to: "/faces/add" });
  }

  return (
    <div className="container pt-16 pb-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-semibold">
          База лиц{" "}
          {!isLoading && (
            <span className="text-base font-normal text-muted-foreground">
              · {visible.length}
              {search && ` из ${users.length}`}
            </span>
          )}
        </h1>
        <Input
          className="w-full sm:w-72"
          placeholder="Поиск по имени или № карты"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleAddButtonClick}>
          <CirclePlus className="mr-2" /> Добавить человека
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          {users.length === 0
            ? "В базе лиц пока никого нет"
            : "Никого не найдено"}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((user) => (
            <PersonCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
