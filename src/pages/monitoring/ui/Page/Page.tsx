import { Button } from '@/shared/ui/button';
import { CircleCheck, CircleX, Monitor } from 'lucide-react';

export function MonitoringPage() {
	return (
		<div className="p-12">
			<h3 className="font-bold text-xl flex align-items">Мониторинг</h3>
			<div
				className="mt-4 rounded-lg border bg-card text-card-foreground shadow-sm p-0 overflow-hidden"
				data-id="28"
				data-v0-t="card"
			>
				<div className="p-0" data-id="29">
					<div className="relative w-full overflow-auto">
						<table className="w-full caption-bottom text-sm" data-id="30">
							<th
								className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
								data-id="31"
							>
								<tr
									className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
									data-id="32"
								>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="35">
										Person from DB
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="36">
										Info
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="37">
										Decision
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="38">
										Last Checked
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="39">
										Actions
									</td>
								</tr>
							</th>
							<tbody className="[&amp;_tr:last-child]:border-0" data-id="40">
								<tr
									className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-green-100"
									data-id="41"
								>
									<td
										className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 flex items-center gap-2 text-xs"
										data-id="42"
									>
										<img
											className="w-48"
											src="https://this-person-does-not-exist.com/img/avatar-gen017610d72ed19cf41445248f637e3a93.jpg"
											alt="random person"
										/>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium" data-id="44">
										<img
											className="w-48"
											src="https://this-person-does-not-exist.com/img/avatar-gen017610d72ed19cf41445248f637e3a93.jpg"
											alt="random person"
										/>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="45">
										<dl>
											<div className="flex">
												<dt className="font-medium">Accuracy:</dt>
												<dd className="ml-1">91%</dd>
											</div>
											<div className="flex">
												<dt>Name:</dt>
												<dd className="ml-1">Sarah</dd>
											</div>
											<div className="flex">
												<dt>Surname:</dt>
												<dd className="ml-1">Connor</dd>
											</div>
											<div className="flex">
												<dt>Room:</dt>
												<dd className="ml-1">532</dd>
											</div>
										</dl>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="48">
										<Button variant="ghost" size="lg" className="h-full">
											<CircleCheck size={64} color="green" />
										</Button>
										<Button variant="ghost" size="lg" className="h-full">
											<CircleX size={64} color="red" />
										</Button>
									</td>
								</tr>
								<tr
									className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-red-100"
									data-id="53"
								>
									<td
										className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 flex items-center gap-2 text-xs"
										data-id="54"
									>
										<img
											className="w-48"
											src="https://this-person-does-not-exist.com/img/avatar-gen017610d72ed19cf41445248f637e3a93.jpg"
											alt="random person"
										/>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium" data-id="56">
										<img
											className="w-48"
											src="https://this-person-does-not-exist.com/img/avatar-gen017610d72ed19cf41445248f637e3a93.jpg"
											alt="random person"
										/>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="57">
										<dl>
											<div className="flex">
												<dt className="font-medium">Accuracy:</dt>
												<dd className="ml-1">68%</dd>
											</div>
											<div className="flex">
												<dt>Name:</dt>
												<dd className="ml-1">Sarah</dd>
											</div>
											<div className="flex">
												<dt>Surname:</dt>
												<dd className="ml-1">Connor</dd>
											</div>
											<div className="flex">
												<dt>Room:</dt>
												<dd className="ml-1">532</dd>
											</div>
										</dl>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="60">
										<Button variant="ghost" size="lg" className="h-full">
											<CircleCheck size={64} color="green" />
										</Button>
										<Button variant="ghost" size="lg" className="h-full">
											<CircleX size={64} color="red" />
										</Button>
									</td>
								</tr>
								<tr
									className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-green-100"
									data-id="41"
								>
									<td
										className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 flex items-center gap-2 text-xs"
										data-id="42"
									>
										<img
											className="w-48"
											src="https://this-person-does-not-exist.com/img/avatar-gen017610d72ed19cf41445248f637e3a93.jpg"
											alt="random person"
										/>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium" data-id="44">
										<img
											className="w-48"
											src="https://this-person-does-not-exist.com/img/avatar-gen017610d72ed19cf41445248f637e3a93.jpg"
											alt="random person"
										/>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="45">
										<dl>
											<div className="flex">
												<dt className="font-medium">Accuracy:</dt>
												<dd className="ml-1">91%</dd>
											</div>
											<div className="flex">
												<dt>Name:</dt>
												<dd className="ml-1">Sarah</dd>
											</div>
											<div className="flex">
												<dt>Surname:</dt>
												<dd className="ml-1">Connor</dd>
											</div>
											<div className="flex">
												<dt>Room:</dt>
												<dd className="ml-1">532</dd>
											</div>
										</dl>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="48">
										<Button variant="ghost" size="lg" className="h-full">
											<CircleCheck size={64} color="green" />
										</Button>
										<Button variant="ghost" size="lg" className="h-full">
											<CircleX size={64} color="red" />
										</Button>
									</td>
								</tr>
								<tr
									className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-red-100"
									data-id="53"
								>
									<td
										className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 flex items-center gap-2 text-xs"
										data-id="54"
									>
										<img
											className="w-48"
											src="https://this-person-does-not-exist.com/img/avatar-gen017610d72ed19cf41445248f637e3a93.jpg"
											alt="random person"
										/>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium" data-id="56">
										<img
											className="w-48"
											src="https://this-person-does-not-exist.com/img/avatar-gen017610d72ed19cf41445248f637e3a93.jpg"
											alt="random person"
										/>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="57">
										<dl>
											<div className="flex">
												<dt className="font-medium">Accuracy:</dt>
												<dd className="ml-1">68%</dd>
											</div>
											<div className="flex">
												<dt>Name:</dt>
												<dd className="ml-1">Sarah</dd>
											</div>
											<div className="flex">
												<dt>Surname:</dt>
												<dd className="ml-1">Connor</dd>
											</div>
											<div className="flex">
												<dt>Room:</dt>
												<dd className="ml-1">532</dd>
											</div>
										</dl>
									</td>
									<td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="60">
										<Button variant="ghost" size="lg" className="h-full">
											<CircleCheck size={64} color="green" />
										</Button>
										<Button variant="ghost" size="lg" className="h-full">
											<CircleX size={64} color="red" />
										</Button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
