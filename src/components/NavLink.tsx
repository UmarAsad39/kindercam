import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type RRClassName = NavLinkProps["className"];

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: RRClassName;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending, isTransitioning }) => {
          const baseClassName =
            typeof className === "function"
              ? className({ isActive, isPending, isTransitioning })
              : className;

          return cn(baseClassName, isActive && activeClassName, isPending && pendingClassName);
        }}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
