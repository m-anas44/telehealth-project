import { CallControls, CallStatsButton, PaginatedGridLayout, SpeakerLayout } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

const MeetingRoom = () => {
    const router = useRouter();

    const handleLeave = () => {
        if (confirm("Are you sure you want to leave the call?")) {
            router.back(); 
        }
    };

    return (
        <section className='relative min-h-screen w-full overflow-hidden pt-4'>
            <div className='relative flex size-full items-center justify-center'>
                <div className='flex size-full max-w-250 items-center'>
                    {/* <PaginatedGridLayout /> */}
                    <SpeakerLayout participantsBarPosition="bottom" />
                </div>
                <div className='fixed bottom-0 flex w-full items-center justify-center gap-5'>
                    <CallControls onLeave={handleLeave} />
                    <CallStatsButton />
                </div>
            </div>
        </section>
    );
};

export default MeetingRoom