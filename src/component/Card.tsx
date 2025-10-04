interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => (
  <div className="card">
    <h2>{title}</h2>
    <div className="card-body">{children}</div>
  </div>
);

export default Card;
