"use client";

import Image from "next/image";

const UserProfileImage = ({
  imageUrl,
  userName
}: {
  imageUrl: string;
  userName: string;
}) => {
  return (
    <div className="flex-shrink-0">
      <Image
        src={imageUrl}
        alt={userName}
        width={100}
        height={100}
        className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
      />
    </div>
  );
};

export default UserProfileImage;
