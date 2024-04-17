"use client"

import { useTransition } from "react"

import { onFollow, onUnFollow } from "@/actions/follow"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { onBlock } from "@/actions/block"

interface ActionsProps {
    isFollowing: boolean;
    userId: string;
}

export const Actions = ({isFollowing,userId}: ActionsProps) => {

    const [isPending,startTransition] = useTransition()

    const handleFollow = ()=> {
        startTransition(()=>{
            onFollow(userId)
            .then((data)=> toast.success(`You are now following ${data.following.username}`))
            .catch(()=> toast.error("Something went wrong"))
        })
    }

    const handleUnfollow = ()=> {
        startTransition(()=>{
            onUnFollow(userId)
            .then((data)=> toast.success(`You have unfollowed ${data.following.username}`))
            .catch(()=> toast.error("Something went wrong"))
        })
    }

    const onCLick = ()=>{

        if(isFollowing) {
            handleUnfollow()
        }else{
            handleFollow()
        }
    }

    const handleBLock = () => {
        startTransition(()=> {
            onBlock(userId)
            .then((data) => toast.success(`Blocked ${data.blocked.username}`))
            .catch(()=>toast.error("Something went wrong"))
        });
    }

    return (
        <>
            <Button 
            disabled={isPending} 
            onClick={onCLick} 
            variant="primary">
                {isFollowing ? "Unfollow": "Follow"}
            </Button>

            <Button onClick={handleBLock} disabled={isPending}>
                Block 
            </Button>
        </>
    );
};