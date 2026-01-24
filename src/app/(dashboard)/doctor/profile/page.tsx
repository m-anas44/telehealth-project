import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ProfileHeader from '../_components/ProfileHeader';
import ProfileTabs from '../_components/ProfileTabs';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader user={session.user}/>

      {/* Profile Settings */}
      <ProfileTabs user={session.user}/>
    </div>
  )
}