/**
 * OwnerContainer — one row in the owners list.
 * Figma: Owner Container (274:258), Property 1 {Person, Company}, 509×92.5.
 * Pure composition: Owner + Badge + Button (Micro) + IconButton (sm, State).
 * Person vs Company differ only by the Owner glyph and copy.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface OwnerContainerArgs {
  name: string;
  percent: string;
  contact: string;
  icon: string;
  badge: boolean;
}

const row = ({ name, percent, contact, icon, badge }: OwnerContainerArgs) => `
  <div class="owner-container">
    <span class="owner"><svg aria-hidden="true"><use href="#${icon}" /></svg></span>
    <div class="owner-container-info">
      <div class="owner-container-title">
        <span class="owner-container-name">${name}</span>
        <span class="badge" ${badge ? "" : "hidden"}>Optional</span>
        <span class="owner-container-percent">${percent}</span>
      </div>
      <div class="owner-container-contact">
        <span class="owner-container-contact-text">${contact}</span>
        <div class="owner-container-actions">
          <button class="btn btn-micro" type="button">
            Edit
            <svg aria-hidden="true"><use href="#pencil" /></svg>
          </button>
          <button class="icon-button icon-button-sm icon-button-state" type="button" aria-label="Remove ${name}">
            <svg aria-hidden="true"><use href="#trash-2" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>`;

const person: OwnerContainerArgs = {
  name: "John Smith",
  percent: "20%",
  contact: "(123) 456-7890 · john.smith@valiify.com",
  icon: "user",
  badge: false,
};

const company: OwnerContainerArgs = {
  name: "Holdings Company, LLC",
  percent: "80%",
  contact: "(123) 456-7890 · contact@holdingsco.com",
  icon: "building",
  badge: false,
};

const meta: Meta<OwnerContainerArgs> = {
  title: "Components/OwnerContainer",
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    percent: { control: "text" },
    contact: { control: "text" },
    icon: {
      control: "select",
      options: ["user", "building"],
      description: "Owner tile glyph — Person uses #user, Company #building",
    },
    badge: { control: "boolean", description: "Figma's `tag` boolean — shows the Optional badge" },
  },
  args: person,
  render: (args) => row(args),
};

export default meta;
type Story = StoryObj<OwnerContainerArgs>;

export const Interactive: Story = {};

export const Person: Story = { render: () => row(person) };

export const Company: Story = { render: () => row(company) };

/** The `tag` boolean shown — the shipped Badge, unhidden. */
export const WithBadge: Story = {
  render: () => row({ ...person, badge: true }),
};

/** Rows stack into an owners list; the hairline divides them. */
export const OwnersList: Story = {
  render: () => `
    <div style="max-width: 560px;">
      ${row(person)}
      ${row({ ...person, name: "Jane Doe", percent: "0%", contact: "(555) 010-2233 · jane.doe@valiify.com" })}
      ${row(company)}
    </div>
  `,
};
