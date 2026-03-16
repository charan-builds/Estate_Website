"use client";

import { Facebook, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";

import { EKAM_SOCIAL_LINKS } from "@/lib/business";

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
};

const socialItems = [
  {
    key: "instagram",
    label: "Instagram",
    href: EKAM_SOCIAL_LINKS.instagram,
    Icon: Instagram,
  },
  {
    key: "facebook",
    label: "Facebook",
    href: EKAM_SOCIAL_LINKS.facebook,
    Icon: Facebook,
  },
  {
    key: "youtube",
    label: "YouTube",
    href: EKAM_SOCIAL_LINKS.youtube,
    Icon: Youtube,
  },
];

export default function SocialLinks({
  className = "",
  iconClassName = "",
}: SocialLinksProps) {
  const links = socialItems.filter((item) => item.href.trim().length > 0);

  if (!links.length) {
    return null;
  }

  return (
    <div className={className}>
      {links.map(({ key, label, href, Icon }) => (
        <motion.a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          className={`inline-flex items-center justify-center rounded-full border border-current/15 p-2 transition ${iconClassName}`}
        >
          <Icon size={18} />
        </motion.a>
      ))}
    </div>
  );
}
