import React from 'react';
import { useRouter } from '@tanstack/react-router';
import { cn } from '@/shared/lib/shadcn-ui/utils';
import { LogOut } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/shared/model';
import { logoutThunk } from '../../model/logout';

type LogoutButtonProps = {
	isOpen: boolean | undefined;
};

export const LogoutButton = React.forwardRef(({ isOpen }: LogoutButtonProps, ref: React.ForwardedRef<unknown>) => {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const handleLogoutClick = () => {
		dispatch(logoutThunk())
			.unwrap()
			.finally(() => router.history.push('/'));
	};

	return (
		<Button onClick={handleLogoutClick} variant="outline" className="w-full justify-center h-10 mt-5">
			<span className={cn(isOpen === false ? '' : 'mr-4')}>
				<LogOut size={18} />
			</span>
			<p className={cn('whitespace-nowrap', isOpen === false ? 'opacity-0 hidden' : 'opacity-100')}>Выйти</p>
		</Button>
	);
});
