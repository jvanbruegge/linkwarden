import {
  CollectionIncludingMembersAndLinkCount,
  LinkIncludingShortenedCollectionAndTags,
} from "@/types/global";
import { faFolder, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Image from "next/image";
import Dropdown from "./Dropdown";
import useLinkStore from "@/store/links";
import useCollectionStore from "@/store/collections";
import useAccountStore from "@/store/account";
import useModalStore from "@/store/modals";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import usePermissions from "@/hooks/usePermissions";
import { toast } from "react-hot-toast";

type Props = {
  link: LinkIncludingShortenedCollectionAndTags;
  count: number;
  className?: string;
};

export default function LinkCard({ link, count, className }: Props) {
  const { setModal } = useModalStore();

  const permissions = usePermissions(link.collection.id as number);

  const [expandDropdown, setExpandDropdown] = useState(false);

  const { collections } = useCollectionStore();

  const { account } = useAccountStore();

  const [collection, setCollection] =
    useState<CollectionIncludingMembersAndLinkCount>(
      collections.find(
        (e) => e.id === link.collection.id
      ) as CollectionIncludingMembersAndLinkCount
    );

  useEffect(() => {
    setCollection(
      collections.find(
        (e) => e.id === link.collection.id
      ) as CollectionIncludingMembersAndLinkCount
    );
  }, [collections]);

  const { removeLink, updateLink } = useLinkStore();

  const pinLink = async () => {
    const isAlreadyPinned = link?.pinnedBy && link.pinnedBy[0];

    const load = toast.loading("Applying...");

    setExpandDropdown(false);

    const response = await updateLink({
      ...link,
      pinnedBy: isAlreadyPinned ? undefined : [{ id: account.id }],
    });

    toast.dismiss(load);

    response.ok &&
      toast.success(`Link ${isAlreadyPinned ? "Unpinned!" : "Pinned!"}`);
  };

  const deleteLink = async () => {
    const load = toast.loading("Deleting...");

    const response = await removeLink(link);

    toast.dismiss(load);

    response.ok && toast.success(`Link Deleted.`);
    setExpandDropdown(false);
  };

  const url = new URL(link.url);
  const formattedDate = new Date(link.createdAt as string).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div
      className={`bg-gradient-to-tr from-slate-200 from-10% to-gray-50 via-20% shadow hover:shadow-none cursor-pointer duration-100 rounded-2xl relative group ${className}`}
    >
      {(permissions === true ||
        permissions?.canUpdate ||
        permissions?.canDelete) && (
        <div
          onClick={() => setExpandDropdown(!expandDropdown)}
          id={"expand-dropdown" + link.id}
          className="text-gray-500 inline-flex rounded-md cursor-pointer hover:bg-slate-200 absolute right-5 top-5 z-10 duration-100 p-1"
        >
          <FontAwesomeIcon
            icon={faEllipsis}
            title="More"
            className="w-5 h-5"
            id={"expand-dropdown" + link.id}
          />
        </div>
      )}

      <div
        onClick={() => {
          setModal({
            modal: "LINK",
            state: true,
            method: "UPDATE",
            isOwnerOrMod:
              permissions === true || (permissions?.canUpdate as boolean),
            active: link,
          });
        }}
        className="flex items-start gap-5 sm:gap-10 h-full w-full p-5"
      >
        <Image
          src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url.origin}&size=32`}
          width={64}
          height={64}
          alt=""
          className="blur-sm absolute w-16 group-hover:opacity-80 duration-100 rounded-md bottom-5 right-5 opacity-60 select-none"
          draggable="false"
          onError={(e) => {
            const target = e.target as HTMLElement;
            target.style.opacity = "0";
          }}
        />

        <div className="flex justify-between gap-5 w-full h-full z-0">
          <div className="flex flex-col justify-between w-full">
            <div className="flex items-baseline gap-1">
              <p className="text-sm text-sky-400 font-bold">{count + 1}.</p>
              <p className="text-lg text-sky-500 font-bold truncate max-w-[10rem] capitalize">
                {link.name}
              </p>
            </div>
            <div className="flex gap-3 items-center flex-wrap my-3">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faFolder}
                  className="w-4 h-4 mt-1 drop-shadow"
                  style={{ color: collection?.color }}
                />
                <p className="text-sky-900 truncate max-w-[10rem] capitalize">
                  {collection?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4" />
              <p>{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>
      {expandDropdown ? (
        <Dropdown
          items={[
            permissions === true
              ? {
                  name:
                    link?.pinnedBy && link.pinnedBy[0]
                      ? "Unpin"
                      : "Pin to Dashboard",
                  onClick: pinLink,
                }
              : undefined,
            permissions === true || permissions?.canUpdate
              ? {
                  name: "Edit",
                  onClick: () => {
                    setModal({
                      modal: "LINK",
                      state: true,
                      method: "UPDATE",
                      isOwnerOrMod:
                        permissions === true || permissions?.canUpdate,
                      active: link,
                      defaultIndex: 1,
                    });
                    setExpandDropdown(false);
                  },
                }
              : undefined,
            permissions === true || permissions?.canDelete
              ? {
                  name: "Delete",
                  onClick: deleteLink,
                }
              : undefined,
          ]}
          onClickOutside={(e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.id !== "expand-dropdown" + link.id)
              setExpandDropdown(false);
          }}
          className="absolute top-12 right-5 w-36"
        />
      ) : null}
    </div>
  );
}
