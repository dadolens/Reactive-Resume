import "@fontsource-variable/ibm-plex-sans";
import "@phosphor-icons/web/regular/style.css";
import "@/styles/globals.css";
import "@/editor/editor.css";

import { createRoot, type Root } from "react-dom/client";
import type { ResumeData } from "@/schema/resume/data";
import { defaultResumeData } from "@/schema/resume/data";
import { EditorApp } from "@/editor/app";
import type { Theme } from "@/utils/theme";
import { isRTL, type Locale } from "@/utils/locale";

const DEFAULT_CSS_HREF = new URL("./assets/resume-editor.css", import.meta.url).toString();
const DEFAULT_ASSETS_BASE_URL = new URL(".", import.meta.url).toString();

class ResumeEditorElement extends HTMLElement {
	private root: Root | null = null;
	private container: HTMLDivElement | null = null;
	private styleLink: HTMLLinkElement | null = null;
	private baseStyle: HTMLStyleElement | null = null;
	private currentValue: ResumeData = defaultResumeData;
	private locale: Locale = "en-US";
	private theme: Theme = "light";
	private assetsBaseUrl: string = DEFAULT_ASSETS_BASE_URL;
	private showPageNumbers = true;
	private cssHref: string = DEFAULT_CSS_HREF;
	private internalUpdate = false;

	static get observedAttributes() {
		return ["value", "locale", "theme", "assets-base-url", "show-page-numbers", "css-href"];
	}

	connectedCallback() {
		if (!this.shadowRoot) {
			this.attachShadow({ mode: "open" });
		}

		if (!this.container) {
			this.container = document.createElement("div");
			this.container.setAttribute("part", "container");
			this.shadowRoot?.appendChild(this.container);
		}

		this.ensureBaseStyle();
		this.ensureStyleLink();

		if (!this.root && this.container) {
			this.root = createRoot(this.container);
		}

		this.render();
	}

	disconnectedCallback() {
		this.root?.unmount();
		this.root = null;
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
		if (newValue === null) return;

		switch (name) {
			case "value": {
				try {
					const parsed = JSON.parse(newValue) as ResumeData;
					this.value = parsed;
				} catch {
					// ignore invalid JSON
				}
				break;
			}
			case "locale": {
				this.locale = newValue as Locale;
				this.render();
				break;
			}
			case "theme": {
				this.theme = newValue as Theme;
				this.render();
				break;
			}
			case "assets-base-url": {
				this.assetsBaseUrl = newValue || DEFAULT_ASSETS_BASE_URL;
				this.render();
				break;
			}
			case "show-page-numbers": {
				this.showPageNumbers = newValue !== "false";
				this.render();
				break;
			}
			case "css-href": {
				this.cssHref = newValue || DEFAULT_CSS_HREF;
				this.ensureStyleLink();
				break;
			}
			default:
				break;
		}
	}

	get value() {
		return this.currentValue;
	}

	set value(nextValue: ResumeData) {
		this.currentValue = nextValue ?? defaultResumeData;
		if (this.internalUpdate) return;
		this.render();
	}

	private ensureStyleLink() {
		if (!this.shadowRoot) return;
		if (!this.styleLink) {
			this.styleLink = document.createElement("link");
			this.styleLink.setAttribute("rel", "stylesheet");
			this.styleLink.setAttribute("part", "styles");
			this.shadowRoot.prepend(this.styleLink);
		}
		this.styleLink.href = this.cssHref;
	}

	private ensureBaseStyle() {
		if (!this.shadowRoot) return;
		if (this.baseStyle) return;
		this.baseStyle = document.createElement("style");
		this.baseStyle.textContent = `:host{display:block;width:100%;height:100%;}`;
		this.shadowRoot.prepend(this.baseStyle);
	}

	private handleChange = (data: ResumeData) => {
		this.internalUpdate = true;
		this.currentValue = data;
		this.dispatchEvent(new CustomEvent("resume-change", { detail: data, bubbles: true, composed: true }));
		this.internalUpdate = false;
	};

	private render() {
		if (!this.root || !this.container) return;

		this.container.classList.toggle("dark", this.theme === "dark");
		this.container.setAttribute("dir", isRTL(this.locale) ? "rtl" : "ltr");
		this.container.classList.add("resume-editor");

		this.root.render(
			<EditorApp
				value={this.currentValue}
				onChange={this.handleChange}
				locale={this.locale}
				theme={this.theme}
				assetsBaseUrl={this.assetsBaseUrl}
				portalContainer={this.container}
				showPageNumbers={this.showPageNumbers}
				className="resume-editor"
			/>,
		);
	}
}

if (!customElements.get("resume-editor")) {
	customElements.define("resume-editor", ResumeEditorElement);
}
