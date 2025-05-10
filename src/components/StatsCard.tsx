interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  className = ""
}) => {
  return (
    <div
      className={`rounded-lg p-6 transition-all duration-200 hover:shadow-md border ${className}`}
    >
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="text-blue-600">{icon}</div>
          <h3 className="text-sm text-center font-medium text-gray-500">
            {title}
          </h3>
        </div>
        <div className="mt-1">
          <div className="text-2xl font-semibold text-gray-900 text-center">
            {value}
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-500 text-center">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
