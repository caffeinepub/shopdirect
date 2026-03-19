import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="bg-white border-t border-border mt-16">
      <div className="max-w-[960px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ background: "oklch(0.74 0.11 193)" }}
              >
                T
              </div>
              <span className="font-bold text-lg text-foreground">
                Tasty Home
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your one-stop shop for premium products at unbeatable prices.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> hello@tastyhome.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> +1 (555) 234-5678
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> San Francisco, CA 94102
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("categories")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-foreground transition-colors"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-foreground transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <span className="cursor-default">About Us</span>
              </li>
              <li>
                <span className="cursor-default">Contact</span>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-foreground transition-colors"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Stay Connected
            </h3>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-6 leading-relaxed">
              Subscribe to our newsletter for deals, updates, and more.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={utm}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
